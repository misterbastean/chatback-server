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
  members: {
    type: [
      {
        userName: String,
        role: {
          type: String,
          enum: ["moderator", "member"],
        },
      },
    ],
    default: [],
  },
  messages: [
    {
      userId: String,
      userName: String,
      userRole: String,
      text: String,
      postedDate: Date,
    },
  ],
  lastUpdatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

// Create TTL index so rooms are deleted at the end of their life
roomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
