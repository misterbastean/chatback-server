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

    // Listen for new messages
    socket.on(NEW_MESSAGE_EVENT, (data) => {
      io.in(roomCode).emit(NEW_MESSAGE_EVENT, data);
    });

    // Leave the room if user closes the socket
    socket.on("disconnect", () => {
      socket.leave(roomCode);
    });
  });
};

module.exports = handleWs;
