require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const routes = require("./routes/room.routes");

// Express setup
const app = express();
app.use(express.json());
app.use(cors());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api/v1/rooms/:roomCode/checkRoomExists", apiLimiter);

// Routes
app.use("/api/v1", routes);

// Listen
app.listen(3001, () => {
  console.log("Started on port 3001");
});
