const router = require("express").Router();
const {getRestaurants, searchRestaurantByName,getRestaurantByName, getRestaurantById} = require("../controllers/restaurant.controller");

router.get("", getRestaurants);
router.get("/search/", searchRestaurantByName);
router.get("/id/:id", getRestaurantById);
router.get("/name/:name", getRestaurantByName);

module.exports = router;
