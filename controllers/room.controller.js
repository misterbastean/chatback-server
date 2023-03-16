const getRooms = (req, res) => {
  console.log("Getting all room data");
  return res.status(200).json({
    status: "Success",
    rooms: ["Room data here"],
  });
};

const createRoom = (req, res) => {
  console.log("DB to create room with code of ", req.roomCode);
  return res.status(201).json({
    status: "Success",
    room: `Room data here. ID is ${req.roomId}`,
  });
};

module.exports = { getRooms, createRoom };
