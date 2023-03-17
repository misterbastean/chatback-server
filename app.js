require("dotenv").config();
const express = require("express");
const routes = require("./routes");

// Express setup
const app = express();
app.use(express.json());

// Routes
app.use("/api/v1", routes);

// Listen
app.listen(3001, () => {
  console.log("Started on port 3001");
});
