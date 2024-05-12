const asyncHandler = require("express-async-handler");
const Menu = require("../models/menu.model");
const { isValidObjectId } = require("mongoose");

exports.createNewCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.token;

  if (!name) {
    res.status(400);
    throw new Error("Category name cannot be empty!");
  }

  const menu = await Menu.findOne({ restaurant: id });

  if (!menu) {
    res.status(404);
    throw new Error("Invalid restaurant credentials!");
  }

  const isCategoryAlreadyExisting = menu.categories.some(
    (category) => category.name === name
  );

  if (isCategoryAlreadyExisting) {
    res.status(400);
    throw new Error("Category already existing!");
  }

  menu.categories.push({ name, items: [] });

  const savedMenu = await menu.save();

  res.status(201).json(savedMenu);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  const { id } = req.token;

  if (!name) {
    res.status(400);
    throw new Error("Category name cannot be empty!");
  }

  if (!categoryId) {
    res.status(400);
    throw new Error("Category id not provided!");
  }

  const menu = await Menu.findOne({ restaurant: id });

  if (!menu) {
    res.status(404);
    throw new Error("Invalid restaurant credentials!");
  }

  const category = menu.categories.find(
    (category) => category.id === categoryId
  );

  if (!category) {
    res.status(404);
    throw new Error("Category not existing!");
  }

  category.name = name;

  const savedMenu = await menu.save();
  res.status(201).json(savedMenu);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const { id } = req.token;

  if (!categoryId) {
    res.status(400);
    throw new Error("Category id not provided!");
  }

  const menu = await Menu.findOne({ restaurant: id });

  if (!menu) {
    res.status(404);
    throw new Error("Invalid restaurant credentials!");
  }

  const filteredCategories = menu.categories.filter(
    (category) => category.id !== categoryId
  );

  menu.categories = filteredCategories;

  await menu.save();

  res.status(200).json({ message: "Category deleted successfully!" });
});

exports.addCategoryMenuItem = asyncHandler(async (req, res) => {
  const { name, image, description, price } = req.body;
  const categoryId = req.params.id;
  const { id } = req.token;

  if (!name || !description || !image || !price) {
    res.status(400);
    throw new Error("All category items fields are mandatory!");
  }

  if (!isValidObjectId(categoryId)) {
    res.status(400);
    throw new Error("Invalid Category id!");
  }

  const menu = await Menu.findOne({ restaurant: id });

  const category = menu.categories.find(
    (category) => category.id === categoryId
  );

  if (!category) {
    res.status(400);
    throw new Error("Category is not existing!");
  }

  const isMenuItemAlreadyExisting = category.items.some(
    (item) => item.name === name
  );

  if (isMenuItemAlreadyExisting) {
    res.status(400);
    throw new Error("Menu item already existing in the category!");
  }

  category.items.push({
    name,
    description,
    image,
    price,
  });

  const savedMenu = await menu.save();

  res.status(201).json(savedMenu);
});

exports.updateCategoryMenuItem = asyncHandler(async (req, res) => {
  const { name, image, description, price } = req.body;
  const { categoryId, menuId } = req.params;

  const { id } = req.token;

  if (!name || !description || !image || !price) {
    res.status(400);
    throw new Error("All category items fields are mandatory!");
  }

  if (!isValidObjectId(categoryId) || !isValidObjectId(menuId)) {
    res.status(400);
    throw new Error("Invalid Category id or Menu id provided!");
  }

  const updatedMenuItem = await Menu.findOneAndUpdate(
    {
      restaurant: id,
      "categories._id": categoryId,
      "categories.items._id": menuId,
    },
    {
      $set: {
        "categories.$[category].items.$[item].name": name,
        "categories.$[category].items.$[item].description": description,
        "categories.$[category].items.$[item].image": image,
        "categories.$[category].items.$[item].price": price,
      },
    },
    {
      arrayFilters: [{ "category._id": categoryId }, { "item._id": menuId }],
      new: true,
    }
  );
  if (!updatedMenuItem) {
    res.status(400);
    throw new Error("Menu item to update not existing!");
  }

  res.status(201).json(updatedMenuItem);
});

exports.deleteCategoryMenuItem = asyncHandler(async (req, res) => {
  const { categoryId, menuId } = req.params;
  const { id } = req.token;

  if (!isValidObjectId(categoryId) || !isValidObjectId(menuId)) {
    res.status(400);
    throw new Error("Invalid Category id or Menu id provided!");
  }

  const deletedMenuItem = await Menu.findOneAndUpdate(
    {
      restaurant: id,
      "categories._id": categoryId,
      "categories.items._id": menuId,
    },
    {
      $pull: {
        "categories.$[category].items": { _id: menuId },
      },
    },
    {
      arrayFilters: [{ "category._id": categoryId }],
      new: true,
    }
  );

  if (!deletedMenuItem) {
    res.status(404);
    throw new Error("Menu item to delete not existing!");
  }

  res.status(200).json({ message: "Menu item deleted successfully!" });
});

exports.getMenuById = asyncHandler(async (req, res) => {
  const { id } = req.token;
  const { menuId } = req.params;

  const menu = await Menu.findOne({ restaurant: id, _id: menuId });

  if (!menu) {
    res.status(404);
    throw new Error("Menu not found!");
  }

  res.status(200).json(menu);
});

exports.getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.token;
  const { id: categoryId } = req.params;

  const category = await Menu.findOne(
    {
      restaurant: id,
      "categories._id": categoryId,
    },
    { "categories.$": 1 }
  );

  if (!category) {
    res.status(404);
    throw new Error("Category not found!");
  }

  res.status(200).json(category);
});

exports.getCategoryItemsById = asyncHandler(async (req, res) => {
  const { id } = req.token;
  const { menuId } = req.params;

  const menuItem = await Menu.findOne(
    {
      restaurant: id,
      "categories.items._id": menuId,
    },
    { "categories.$": 1 }
  );

  if (!menuItem) {
    res.status(404);
    throw new Error("Menu item not found!");
  }

  res.status(200).json(menuItem);
});
