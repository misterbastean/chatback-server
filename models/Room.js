const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  moderator: {
    type: {
      id: String,
      name: String,
    },
    required: true,
    _id: false,
  },
  messages: [
    {
      userName: String,
      text: String,
      postedDate: Date,
    },
  ],
  lastUpdatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
