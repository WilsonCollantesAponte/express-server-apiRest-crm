const express = require("express");
const morgan = require("morgan");
const router = require("./routes/routes");
const server = express();

server.use(morgan("dev"));
server.use(express.json());

server.use("/", router);

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

module.exports = server;
