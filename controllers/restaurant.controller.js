const asyncHandler = require("express-async-handler");
const Restaurant = require("../models/restaurant.model");
const CustomError = require("../utils/CustomError");

exports.getRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find();

  res.status(200).json(restaurants);
});

exports.searchRestaurantByName = asyncHandler(async (req, res) => {
  const { name } = req.query;

  const restaurants = await Restaurant.find({ name: {$regex: name, $options: 'i'} });
  res.status(200).json(restaurants);
});

exports.getRestaurantByName = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const restaurant = await Restaurant.find({ name: name});

  if (!restaurant) {
    throw new CustomError("RestaurantNotFound", "Restaurant not found!");
  }

  res.status(200).json(restaurant);
});

exports.getRestaurantById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findById(id).populate("menu");

  if (!restaurant) {
    throw new CustomError("RestaurantNotFound", "Restaurant not found!");
  }

  res.status(200).json(restaurant);
});
