const {
  getAvailableSeats,
  reserveSeat,
} = require("../controllers/reservation.controller");

const router = require("express").Router();

router.get("/seats", getAvailableSeats);
router.post("/reserve", reserveSeat);
module.exports = router;
