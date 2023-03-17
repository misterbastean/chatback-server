const Room = require("../models/Room");

const getRoom = async (req, res) => {
  const rooms = await Room.find({ roomCode: req.params.roomCode }).select(
    "_id roomCode"
  );

  return res.status(200).json({
    status: "Success",
    rooms,
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

module.exports = { getRoom, createRoom };
