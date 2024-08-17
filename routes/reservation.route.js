const {
  getAvailableSeats,
  reserveSeat,
  getReservationById,
  getReservationByRestaurantId,
} = require("../controllers/reservation.controller");

const { verifyToken } = require("../middleware/verifyToken");

const router = require("express").Router();

router.get("/seats", getAvailableSeats);
router.post("/reserve", reserveSeat);
router.get("/get-reservation", getReservationById);
router.get("/restaurant", verifyToken, getReservationByRestaurantId);

module.exports = router;
