const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
  },
  categories: [
    {
      name: { type: String, require: [true, "Category name cannot be empty!"] },
      items: [
        {
          name: {
            type: String,
            require: [true, "Menu item name cannot be empty!"],
            unqiue: [true, "Menu item name should be unique!"],
          },
          image: {
            type: String,
            require: [true, "Menu item name cannot be empty!"],
          },
          description: {
            type: String,
            require: [true, "Menu item description cannot be empty!"],
          },
          price: {
            type: String,
            require: [true, "Menu item price cannot be empty!"],
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("menu", MenuSchema);
