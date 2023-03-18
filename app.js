require("./src/config/database");
const express = require("express");
const bodyParser = express.json;
const cors = require("cors");
const routes = require("./src/routes");

//create server app
const app = express();

//middlewares
app.use(cors());
app.use(bodyParser());
app.use("/api/pharmablockchain", routes);

module.exports = app;
