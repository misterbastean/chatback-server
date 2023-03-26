const express = require("express");
const db = require("../utils/db")();
const {
  getRoom,
  createRoom,
  checkRoomExists,
  joinRoom,
} = require("../controllers/room.controller");

const router = express.Router();

router.route("/rooms").post(createRoom);
router.route("/rooms/:roomCode").get(getRoom).patch(joinRoom);
router.route("/rooms/:roomCode/checkRoomExists").get(checkRoomExists); // TODO: Add rate limiter

module.exports = router;
