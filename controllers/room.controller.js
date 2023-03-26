const Room = require("../models/Room");
const { containsProfanity } = require("../utils/profanityFilter");

const getRoom = async (req, res) => {
  const rooms = await Room.find({ roomCode: req.params.roomCode }).select(
    "_id roomCode roomName messages"
  );

  if (!rooms) {
    return res.status(404).json({
      success: true,
      message: `No room found with roomCode of ${req.params.roomCode}`,
    });
  }

  return res.status(200).json({
    success: true,
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
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }

  // Create room in DB
  if (containsProfanity([req.body.userName, req.body.roomName])) {
    return res.status(400).json({
      success: false,
      message:
        "Profanity is not allowed in any room information, including username.",
    });
  }
  const roomName = req.body.roomName || "Unnamed ChatBack";
  const roomData = {
    roomCode,
    roomName,
    members: [
      {
        userName: req.body.userName,
        role: "moderator",
      },
    ],
    messages: [],
    expiresAt: new Date(
      new Date().setDate(new Date().getDate() + req.body.roomDays)
    ),
  };
  const newRoom = await Room.create(roomData);

  return res.status(201).json({
    success: true,
    room: newRoom,
  });
};

const joinRoom = async (req, res) => {
  // Add user to room in DB
  console.log("joinRoom req.body:", req.body);
  const newMember = {
    userName: req.body.userName,
    role: "member",
  };

  const update = { $push: { members: newMember } };
  const room = await Room.findOneAndUpdate(
    { roomCode: req.body.roomCode.toUpperCase() },
    update,
    {
      new: true,
    }
  );

  // Respond with user details
  res.status(200).json({
    success: true,
    room, // Update to just user info to prevent user spoofing
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
  // Check for profanity
  if (containsProfanity([text])) {
    console.log("Profanity filtered from roomCode:", text);
    text = getRandomCode(roomCodeLength);
  }
  return text;
};

const generateNewRoomCode = async (roomCodeLength) => {
  let roomCode = await getRandomCode(roomCodeLength);

  for (let i = 0; i < 5; i++) {
    const duplicateCode = await Room.findOne({ roomCode });
    if (!duplicateCode) return roomCode;
    console.log(
      `Duplicate room code found, generating again. Retried ${i + 1} times.`
    );
    roomCode = await getRandomCode(roomCodeLength);
  }

  throw new Error("Unable to generate unique room code.");
};

module.exports = { getRoom, createRoom, checkRoomExists, joinRoom };
