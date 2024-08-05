const mongoose = require("mongoose");
const { default: isEmail } = require("validator/lib/isEmail");

const AddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  province: String,
  postalCode: String,
  country: String,
});

const BusinessHourSchema = new mongoose.Schema({
  from: String,
  to: String,
});

const SeatingArrangementSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    require: [true, "Table number cannot be empty!"],
  },
  capacity: {
    type: Number,
    require: [true, "Table capacity cannot be empty!"],
  },
});

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, require: [true, "Name cannot be empty!"] },
  email: {
    type: String,
    require: [true, "Email cannot be empty!"],
    unique: [true, "Email already exists!"],
    lowercase: true,
    validator: [isEmail, "Invalid email address!"],
  },
  password: {
    type: String,
    require: [true, "Password cannot be empty!"],
    minLength: [3, "Password should have minimum 3 characters!"],
    select: false,
  },
  address: {
    type: AddressSchema,
    default: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
  },
  phoneNumber: {
    type: Number,
    min: [10, "Phone number should have 10 numbers!"],
    max: [10, "Phone number should have 10 numbers!"],
    default: "",
  },
  url: { type: String, default: "" },
  about: { type: String, default: "" },
  cuisine: { type: String, default: "" },
  bannerImageHref: { type: String, default: "" },
  logoHref: { type: String, default: "" },
  rating: { type: String, default: 0 },
  // 0 -> Sunday, 6 -> Saturday
  businessHours: {
    type: [BusinessHourSchema],
    default: [
      { from: "", to: "" },
      { from: "", to: "" },
      { from: "", to: "" },
      { from: "", to: "" },
      { from: "", to: "" },
      { from: "", to: "" },
      { from: "", to: "" },
    ],
  },
  seatingArrangements: { type: [SeatingArrangementSchema] },
  slotInterval: {
    type: Number,
    default: 60,
  },
  rating: Number,
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "menu",
  },
  reservations: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "reservations",
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("restaurants", RestaurantSchema);
