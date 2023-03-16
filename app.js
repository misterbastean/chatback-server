const express = require("express");
const routes = require("./routes");

const app = express();

app.use("/api/v1", routes);

app.listen(3001, () => {
  console.log("Started on port 3001");
});
