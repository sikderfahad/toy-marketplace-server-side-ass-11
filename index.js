const express = require("express");
const cors = require("cors");
require("dotenv").config();
const data = require("./data.json");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Toyes server is Running...!");
});

app.get("/toyes", (req, res) => {
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
