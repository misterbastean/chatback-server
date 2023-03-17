const express = require("express");
const db = require("./utils/db")();
const { getRooms, createRoom } = require("./controllers/room.controller");

const router = express.Router();

router.route("/rooms").get(getRooms).post(createRoom);

module.exports = router;
