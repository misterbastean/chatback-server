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
  // Generate new room code
  let roomCode;
  try {
    roomCode = await generateNewRoomCode(4);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }

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

const checkRoomExists = async (req, res) => {
  const room = await Room.findOne({ roomCode: req.params.roomCode });
  if (room) {
    return res.status(200).json({
      success: true,
      message: `Room with roomCode of ${req.params.roomCode} exists.`,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: `Room with roomCode of ${req.params.roomCode} does not exist.`,
    });
  }
};

// Helpers
const getRandomCode = (roomCodeLength) => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < roomCodeLength; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const generateNewRoomCode = async (roomCodeLength) => {
  let roomCode = await getRandomCode(roomCodeLength);
  console.log("roomCode:", roomCode);

  for (let i = 0; i < 5; i++) {
    console.log("Loop:", i);
    const duplicateCode = await Room.findOne({ roomCode });
    if (!duplicateCode) return roomCode;
    console.log(
      `Duplicate room code found, generating again. Retried ${i + 1} times.`
    );
    roomCode = await getRandomCode(roomCodeLength);
  }

  throw new Error("Unable to generate unique room code.");
};

module.exports = { getRoom, createRoom, checkRoomExists };
