const {
  createRestaurant,
  loginToRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantAuth.controller");
const { verifyToken } = require("../middleware/verifyToken");

const router = require("express").Router();

router.post("/register", createRestaurant);
router.post("/login", loginToRestaurant);

router.put("/update", verifyToken, updateRestaurant);
router.delete("/delete", verifyToken, deleteRestaurant);

module.exports = router;
