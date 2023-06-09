const Room = require("../models/Room");
const NEW_MESSAGE_EVENT = "newChatMessage";
const ERROR_EVENT = "error";
const { censorProfanity } = require("../utils/profanityFilter");

const sockets = new Map();

const handleWs = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    const { userId, roomCode } = socket.handshake.query;

    // Add WS to sockets map
    const socketId = getSocketId(userId, roomCode);
    sockets.set(socketId, socket);

    // Join a room
    socket.join(roomCode);

    // Load all previous messages whenever a client joins
    socket.on("loadMessages", async () => {
      const room = await Room.findOne({ roomCode });
      if (!room) {
        const errorBody = {
          message: `Room with roomCode of ${roomCode} not found.`,
          code: 404,
        };
        socket.emit(ERROR_EVENT, JSON.stringify(errorBody));
        return;
        // TODO: Need to handle this event on the FE
      }

      socket.emit("previousMessages", room.messages);
    });

    // Listen for new messages
    socket.on(NEW_MESSAGE_EVENT, async (data) => {
      const room = await Room.findOne({ roomCode });
      sendingUser = room.members.find(
        (user) => user._id.toString() === data.userId
      );
      if (!sendingUser) return; // TODO: handle incorrect/invalid userId submitted

      // Censor profanity
      const parsedText = censorProfanity(data.text);

      // Add message to room in DB
      newMessage = {
        text: parsedText,
        postedDate: data.postedDate,
        userName: sendingUser.userName,
        userRole: sendingUser.role,
        userId: sendingUser._id,
      };
      const update = { $push: { messages: newMessage } };

      const updatedRoom = await Room.findOneAndUpdate({ roomCode }, update, {
        new: true,
      });

      if (!updatedRoom) return; // TODO: Add error handling if message sent to room that doesn't exist

      // Publish message to all users in room
      io.in(roomCode).emit(
        NEW_MESSAGE_EVENT,
        updatedRoom.messages[updatedRoom.messages.length - 1]
      );
    });

    // Leave the room if user closes the socket
    socket.on("disconnect", async () => {
      const room = await Room.findOne({ roomCode });
      if (!room) return;

      // If user is not moderator, remove from room in DB
      if (isModerator(room.members, userId)) {
        const update = {
          $pull: { members: { _id: userId, role: "member" } },
        };
        await Room.findOneAndUpdate({ roomCode }, update);
      }

      // Remove user from sockets map (all roles, since reconnect will add a new socket)
      const socketIdToRemove = getSocketId(userId, roomCode);
      sockets.delete(socketIdToRemove);
      socket.leave(roomCode);
    });
  });
};

// Helpers
const getSocketId = (userId, roomCode) => `${userId}-${roomCode}`;

const isModerator = (arr, id) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]._id === id) {
      return arr[i].role === "moderator";
    }
  }
  return false;
};

module.exports = handleWs;
