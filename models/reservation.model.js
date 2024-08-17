const mongoose = require("mongoose");

/*
 * - Select a restaurant
 * - Select total number of person
 * - Select a date
 * - Select a time slot
 * - Query the reservations on the give date and time, filter the tables, 
 *   mark the reserved tables, and return a list unreserved tables 
 *   that match the person count
 * - If data is not present in reservations object, no reservation for 
 *   the date, all time slots, all tables available
 * - If date preset, but that time slot not present, all tables available 
 *   for that time slot
 * 
 * RESERVATION
  {
    restaurantId: ''
    reservations: {
        '12-04-2024': {
            '05:00-06:00':[{
                _id: ''
                tableNumber: 1,
                totalPersons: '',
                date: '',
                time: ''
                userName: ''
            }]
        }
    }
  }
  {
      "from": "11:00",
      "to": "18:00",
      "_id": "664a35d48d0a636fc67b618c"
  },
 */

const ReservationsSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
  },
  reservations: {
    type: Map,
    of: {
      type: Map,
      of: [
        {
          tableNumber: {
            type: Number,
            require: [true, "Table number cannot be empty"],
          },
          totalPersons: {
            type: Number,
            require: [true, "Total persons cannot be empty"],
          },
          date: {
            type: Date,
            require: [true, "Date cannot be empty"],
          },
          time: {
            type: String,
            require: [true, "Time cannot be empty"],
          },
          userName: {
            type: String,
            require: [true, "User name cannot be empty"],
          },
          email: {
            type: String,
            require: [true, "Email cannot be empty"],
          },
          phoneNumber: {
            type: String,
            require: [true, "Phone Number cannot be empty"],
          },
        },
      ],
    },
  },
});

module.exports = mongoose.model("reservations", ReservationsSchema);
