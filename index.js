require("dotenv").config();
const express = require("express");
const connectToDb = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

connectToDb();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
