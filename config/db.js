const mongoose = require("mongoose");

const connectToDb = () => {
  try {
    mongoose.connect(process.env.DATABASE_URL);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }

  const dbConnection = mongoose.connection;

  dbConnection.once("error", (e) => {
    console.log("Database connection failed", e);
  });

  dbConnection.once("connected", (e) => {
    console.log("⚡️[DB]: Database connected");
  });
};

module.exports = connectToDb;
