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
      const joinMessage = {
        _id: "0",
        text: "You joined the room",
        userName: "You",
        postedDate: Date.now(),
      };
      const messages = [joinMessage, ...room.messages]; // fetch messages from database or wherever they are stored
      socket.emit("previousMessages", messages);
    });

    // Listen for new messages
    socket.on(NEW_MESSAGE_EVENT, async (data) => {
      // Add message to room in DB
      newMessage = {
        text: data.text,
        postedDate: data.postedDate,
        userName: data.userName,
      };
      const update = { $push: { messages: newMessage } };
      const updatedRoom = await Room.findOneAndUpdate({ roomCode }, update, {
        new: true,
      });

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
