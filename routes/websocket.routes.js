const demoMessages = [
  {
    _id: "1",
    text: "Bacon ipsum dolor amet bresaola pancetta hamburger, tenderloin beef rump landjaeger pork belly corned beef pig",
    userName: "Josh",
    postedDate: Date.now(),
  },
  {
    _id: "2",
    text: "Pancetta pork chop alcatra, shank jowl chicken pork belly sausage. Sirloin ground round ham shank, capicola cupim cow alcatra short loin doner frankfurter.",
    userName: "Kim",
    postedDate: Date.now(),
  },
  {
    _id: "3",
    text: "Brisket meatloaf chislic kielbasa, cupim hamburger pig drumstick buffalo fatback pork chop tail.",
    userName: "Zoe",
    postedDate: Date.now(),
  },
  {
    _id: "4",
    text: "lulz",
    userName: "Jacob",
    postedDate: Date.now(),
  },
  {
    _id: "5",
    text: "Bacon ipsum dolor amet bresaola pancetta hamburger, tenderloin beef rump landjaeger pork belly corned beef pig",
    userName: "Maggie",
    postedDate: Date.now(),
  },
];

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
    socket.on("loadMessages", () => {
      console.log("loadMessages WS event received");
      const messages = [...demoMessages]; // fetch messages from database or wherever they are stored
      socket.emit("previousMessages", messages);
    });

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
