require("dotenv").config();
const express = require("express");
const connectToDb = require("./config/db");
const restaurantAuthRoutes = require("./routes/restaurantAuth.route");
const menuRoutes = require("./routes/menu.route");

const errorHandler = require("./middleware/errorHandler");
const app = express();
const PORT = process.env.PORT || 3000;

connectToDb();

app.use(express.json());

app.use("/api/v1/restaurant/auth", restaurantAuthRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
