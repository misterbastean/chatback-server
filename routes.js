const express = require("express");
const db = require("./utils/db")();
const { getRoom, createRoom } = require("./controllers/room.controller");

const router = express.Router();

router.route("/rooms").post(createRoom);
router.route("/rooms/:roomCode").get(getRoom);

module.exports = router;
