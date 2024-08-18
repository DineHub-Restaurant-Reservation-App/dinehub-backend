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


connectToDb();

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:4200',"https://dinehub-backend.onrender.com"] // Whitelist the domains you want to allow
};

app.use(cors(corsOptions)); // Use the cors middleware with your options


app.use(express.json());

app.use("/api/v1/restaurant/auth", restaurantAuthRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/reservation", reservationRoutes);
app.use("/api/v1/restaurants", restaurantRoutes);

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

