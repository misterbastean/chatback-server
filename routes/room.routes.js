const express = require("express");
const db = require("../utils/db")();
const {
  getRoom,
  createRoom,
  checkRoomExists,
} = require("../controllers/room.controller");

const router = express.Router();

router.route("/rooms").post(createRoom);
router.route("/rooms/:roomCode").get(getRoom);
router.route("/rooms/:roomCode/checkRoomExists").get(checkRoomExists); // TODO: Add rate limiter

module.exports = router;
