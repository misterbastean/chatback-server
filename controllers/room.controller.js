const Room = require("../models/Room");

const getRooms = (req, res) => {
  console.log("Getting all room data");
  return res.status(200).json({
    status: "Success",
    rooms: ["Room data here"],
  });
};

const createRoom = async (req, res) => {
  console.log("DB to create new room");

  // Get all current room codes
  // Generate new unique room code
  const roomCode = "abcd";

  // Create room in DB
  const roomData = {
    ...req.body,
    roomCode,
    messages: [],
  };
  const newRoom = await Room.create(roomData);

  return res.status(201).json({
    status: "Success",
    room: newRoom,
  });
};

module.exports = { getRooms, createRoom };
