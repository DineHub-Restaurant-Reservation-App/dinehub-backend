const asyncHandler = require("express-async-handler");
const Restaurant = require("../models/restaurant.model");
const bcrypt = require("bcrypt");
const { createToken } = require("../middleware/verifyToken");
const { isRestaurantDataValid } = require("../utils/restaurantValidator");
const Menu = require("../models/menu.model");

const createRestaurant = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const isRestaurantAlreadyExisting = await Restaurant.find({ email });

  if (isRestaurantAlreadyExisting.length != 0) {
    res.status(400);
    throw new Error(`Restaurant with email: ${email} already existing!`);
  }

  const genSalt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, genSalt);

  const restaurant = await Restaurant.create({
    name,
    email,
    password: hashedPassword,
  });

  const menu = await Menu.create({
    restaurant: restaurant._id,
    categories: [],
  });

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    restaurant._id,
    {
      menu: menu._id,
    },
    {
      new: true,
    }
  );

  if (!restaurant) {
    res.status(400);
    throw new Error("Invalid data!");
  }

  res.status(201).json(updatedRestaurant);
});

const loginToRestaurant = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password cannot be empty!");
  }

  const restaurant = await Restaurant.findOne({ email }).select("+password");

  if (!restaurant) {
    res.status(401);
    throw new Error("Account not existing!");
  }

  if (restaurant && (await bcrypt.compare(password, restaurant.password))) {
    const token = createToken({ id: restaurant.id });
    res.status(200).json({ id: restaurant.id, token });
  } else {
    res.status(401);
    throw new Error("Invalid email or password!");
  }
});

const updateRestaurant = asyncHandler(async (req, res) => {
  console.log("Inside updateRestaurant controller");
  const { id } = req.token;

  const isValid = isRestaurantDataValid(req.body, res);

  if (!isValid) {
    restart.status(400);
    throw new Error("All fields are mandatory!");
  }

  const updateRestaurantInfo = await Restaurant.findByIdAndUpdate(
    id,
    { ...req.body, isVisible: true },
    {
      new: true,
    }
  );

  res.status(200).json(updateRestaurantInfo);
});

const deleteRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.token;

  const restaurant = await Restaurant.findByIdAndDelete(id);

  // await Menu.findByIdAndDelete(restaurant.menu);

  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant to delete not found!");
  }
  res.status(200).json({ message: "Restaurant deleted successfully!" });
});

module.exports = {
  createRestaurant,
  loginToRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
