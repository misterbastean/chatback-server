const Room = require("../models/Room");
const NEW_MESSAGE_EVENT = "newChatMessage";

const handleWs = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    // Join a room
    const { roomCode } = socket.handshake.query;
    socket.join(roomCode);

    // Load all previous messages whenever a client joins
    socket.on("loadMessages", async () => {
      console.log("loadMessages WS event received");
      const room = await Room.findOne({ roomCode });

      if (!room) return; // TODO: Add error handling for room not found

      socket.emit("previousMessages", room.messages);
    });

    // Listen for new messages
    socket.on(NEW_MESSAGE_EVENT, async (data) => {
      const room = await Room.findOne({ roomCode });
      sendingUser = room.members.find(
        (user) => user._id.toString() === data.userId
      );
      if (!sendingUser) return; // TODO: handle incorrect/invalid userId submitted
      // Add message to room in DB
      newMessage = {
        text: data.text,
        postedDate: data.postedDate,
        userName: sendingUser.userName,
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
    socket.on("disconnect", () => {
      socket.leave(roomCode);
    });
  });
};

module.exports = handleWs;
