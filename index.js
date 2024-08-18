require("dotenv").config();
const express = require("express");
const cors = require('cors');

const connectToDb = require("./config/db");
const restaurantAuthRoutes = require("./routes/restaurantAuth.route");
const menuRoutes = require("./routes/menu.route");
const reservationRoutes = require("./routes/reservation.route");
const restaurantRoutes = require("./routes/restaurant.route");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectToDb();

// CORS configuration
const corsOptions = {
  credentials: true,
  origin: ['http://localhost:4200', 'https://dinehub-b2bf.onrender.com/*'] // List all origins that need to be allowed
};

// Apply CORS middleware before defining routes
app.use(cors());

app.use(express.json());

// Define routes
app.use("/api/v1/restaurant/auth", restaurantAuthRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/reservation", reservationRoutes);
app.use("/api/v1/restaurants", restaurantRoutes);

// Error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running!`);
});
