const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomCode: {
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
      user: String,
      text: String,
      createdAt: Date,
    },
  ],
  lastUpdatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
