const asyncHandler = require("express-async-handler");
const Reservation = require("../models/reservation.model");
const CustomError = require("../utils/CustomError");
const Restaurant = require("../models/restaurant.model");

exports.getAvailableSeats = asyncHandler(async (req, res) => {
  const { restaurantId, totalNumberOfPersons, date } = req.body;

  const dateToReserve = new Date(date);

  if (isNaN(dateToReserve.getTime())) {
    throw new CustomError("DateParsingError", "Invalid date provided.");
  }

  const today = new Date();

  if (dateToReserve < today) {
    throw new Error("The reservation date cannot be earlier than today.");
  }

  const restaurantReservations = await Reservation.findOne({
    restaurant: restaurantId,
  });

  if (!restaurantReservations) {
    throw new CustomError(
      "RestaurantNotFound",
      "Restaurant not available to reserve!"
    );
  }

  const restaurant = await Restaurant.findById(restaurantId);
  const businessHoursOfReservationDay =
    restaurant.businessHours[dateToReserve.getUTCDay()];

 const isDateHavingReservations =
    restaurantReservations.reservations.hasOwnProperty(dateToReserve); 

  const timeSlots = getTimeSlots(restaurant, businessHoursOfReservationDay);

  if (!isDateHavingReservations) {
    res.json(timeSlots);
    return;
  }

  const reservations = restaurantReservations.reservations[dateToReserve];

  const tablesWithMatchingCapacity = {};
  let tablesWithMatchingCapacityLength = 0;
  restaurant.seatingArrangements.map((table) => {
    if (table.capacity >= totalNumberOfPersons) {
      tablesWithMatchingCapacity[table.tableNumber] = table;
      tablesWithMatchingCapacityLength++;
    }
  });

  const availableTimeSlots = timeSlots.filter((slot) => {
    const isSlotHavingReservations = reservations.hasOwnProperty(slot);
    if (!isSlotHavingReservations) {
      return true;
    }
    const reservedSlot = reservations[slot];

    const reservedTablesWithMatcingCapacity = reservedSlot.map((table) => {
      if (tablesWithMatchingCapacity.hasOwnProperty(table.tableNumber)) {
        return table.tableNumber;
      }
    });

    if (
      reservedTablesWithMatcingCapacity.length ===
      tablesWithMatchingCapacityLength
    ) {
      return false;
    }
    return true;
  });

  res.json(availableTimeSlots);
});

const getTimeSlots = (restaurant, businessHours) => {
  const slots = [];

  let startingTime = businessHours.from;

  const slotInterval = restaurant.slotInterval;

  while (startingTime < businessHours.to) {

    const endingTime = getEndingTime(startingTime, slotInterval);
    slots.push(`${startingTime}-${endingTime}`);

    startingTime = endingTime;
  }

  return slots;
};

const getEndingTime = (time, slotInterval) => {
  const [hours, minutes] = time.split(":");

  const endingTime = new Date(0, 0, 0, hours, minutes);
  endingTime.setMinutes(endingTime.getMinutes() + slotInterval);

  return endingTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const convertTimeToLocaleTimeString = (timeStr) => {
  const [hours, minutes] = timeStr.split(":");

  console.log("timeStr:", timeStr, hours, minutes);
  const time = new Date(0, 0, 0, hours, minutes);
  return time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// TODO: fix time format
exports.reserveSeat = asyncHandler(async (req, res) => {
  const { restaurantId, totalNumberOfPersons, date, time: reservationTime, reservationName } = req.body;

  // Parse the reservation date
  const reservationDate = new Date(date);

  // Validate the reservation date
  if (isNaN(reservationDate.getTime())) {
    throw new CustomError("DateParsingError", "Invalid date provided.");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (reservationDate <= today) {
    throw new CustomError("InvalidDate", "The reservation date cannot be earlier than today.");
  }

  const reservationDateKey = reservationDate.toLocaleDateString(); // Use locale date string for date key

  // Find the existing reservations for the restaurant
  let restaurantReservations = await Reservation.findOne({ restaurant: restaurantId });

  if (!restaurantReservations) {
    // If not found, initialize a new reservation record for the restaurant
    restaurantReservations = new Reservation({
      restaurant: restaurantId,
      reservations: new Map(),
    });
  }

  // Ensure the date and time slot maps exist
  if (!restaurantReservations.reservations.has(reservationDateKey)) {
    restaurantReservations.reservations.set(reservationDateKey, new Map());
  }

  const reservationsForTheDay = restaurantReservations.reservations.get(reservationDateKey);

  if (!reservationsForTheDay.has(reservationTime)) {
    reservationsForTheDay.set(reservationTime, []);
  }

  const reservationsForTheTime = reservationsForTheDay.get(reservationTime);

  // Find the restaurant details to check seating arrangements
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    throw new CustomError("RestaurantNotFound", "Restaurant not found.");
  }

  // Find tables that can accommodate the required number of persons
  const sortedTables = restaurant.seatingArrangements.sort((tableA, tableB) => tableA.capacity - tableB.capacity);

  const matchingTablesForReservation = sortedTables.filter(table => table.capacity >= totalNumberOfPersons);

  if (matchingTablesForReservation.length === 0) {
    throw new CustomError("TableNotFoundError", "No table available to accommodate the specified number of persons.");
  }

  // Find an available table
  const tableToBook = findTable(matchingTablesForReservation, reservationsForTheTime, totalNumberOfPersons);

  if (!tableToBook) {
    throw new CustomError("TablesBooked", "All tables are currently booked. Please try a different time slot or reduce the number of persons.");
  }

  // Create a new reservation entry
  const newReservation = {
    tableNumber: tableToBook.tableNumber,
    totalPersons: totalNumberOfPersons,
    date: reservationDate,
    time: reservationTime,
    userName: reservationName,
  };

  // Add the new reservation to the time slot
  reservationsForTheTime.push(newReservation);

  // Convert Map to plain object for saving to MongoDB
  restaurantReservations.reservations.set(reservationDateKey, reservationsForTheDay);
  const reservationsObject = Object.fromEntries(restaurantReservations.reservations);

  // Save the updated reservation document
  const savedReservation = await Reservation.findOneAndUpdate(
    { restaurant: restaurantId },
    { $set: { reservations: reservationsObject } },
    { upsert: true, returnDocument: "after" }
  );

  // Respond with the saved reservation details
  res.json(savedReservation);
});
function findTable(
  matchingTables,
  reservationsForTheTime,
  totalNumberOfPersons
) {
  for (const table of matchingTables) {
    const isTableAvailable = !reservationsForTheTime.some(
      (reservation) => reservation.tableNumber === table.tableNumber
    );
    if (isTableAvailable) {
      return table;
    }
  }
  return null;
}
