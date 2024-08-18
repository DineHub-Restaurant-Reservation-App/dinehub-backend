const asyncHandler = require("express-async-handler");
const Reservation = require("../models/reservation.model");
const CustomError = require("../utils/CustomError");
const Restaurant = require("../models/restaurant.model");
const { default: mongoose } = require("mongoose");

exports.getAvailableSeats = asyncHandler(async (req, res) => {
  const { restaurantId, totalNumberOfPersons, date } = req.query;

  const dateToReserve = new Date(date);
  dateToReserve.setHours(0, 0, 0, 0); // Normalize to midnight local time

  if (isNaN(dateToReserve.getTime())) {
    res.status(400);
    throw new CustomError("DateParsingError", "Invalid date provided.");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight local time

  if (dateToReserve < today) {
    res.status(400);
    throw new Error("The reservation date cannot be earlier than today.");
  }

  const restaurantReservations = await Reservation.findOne({
    restaurant: restaurantId,
  });

  if (!restaurantReservations) {
    res.status(400);
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

  const time = new Date(0, 0, 0, hours, minutes);
  return time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// TODO: fix time format
exports.reserveSeat = asyncHandler(async (req, res) => {
  const {
    restaurantId,
    totalNumberOfPersons,
    date,
    time: reservationTime,
    reservationName,
    email,
    phoneNumber
  } = req.body;

  // Parse the reservation date and normalize to local midnight
  const reservationDate = new Date(date);
  reservationDate.setHours(0, 0, 0, 0); // Normalize to midnight local time

  // Normalize today's date to midnight local time
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Validate that the reservation date is not earlier than today
  if (reservationDate < today) {
    res.status(400);
    throw new CustomError(
      "InvalidDate",
      "The reservation date cannot be earlier than today."
    );
  }

  const reservationDateKey = reservationDate.toLocaleDateString(); // Use locale date string for date key

  // Find the existing reservations for the restaurant
  let restaurantReservations = await Reservation.findOne({
    restaurant: restaurantId,
  });

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

  const reservationsForTheDay =
    restaurantReservations.reservations.get(reservationDateKey);

  if (!reservationsForTheDay.has(reservationTime)) {
    reservationsForTheDay.set(reservationTime, []);
  }

  const reservationsForTheTime = reservationsForTheDay.get(reservationTime);

  // Find the restaurant details to check seating arrangements
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    res.status(404);
    throw new CustomError("RestaurantNotFound", "Restaurant not found.");
  }

  // Find tables that can accommodate the required number of persons
  const sortedTables = restaurant.seatingArrangements.sort(
    (tableA, tableB) => tableA.capacity - tableB.capacity
  );

  const matchingTablesForReservation = sortedTables.filter(
    (table) => table.capacity >= totalNumberOfPersons
  );

  if (matchingTablesForReservation.length === 0) {
    res.status(404);
    throw new CustomError(
      "TableNotFoundError",
      "No table available to accommodate the specified number of persons."
    );
  }

  // Find an available table
  const tableToBook = findTable(
    matchingTablesForReservation,
    reservationsForTheTime,
    totalNumberOfPersons
  );

  if (!tableToBook) {
    res.status(404);
    throw new CustomError(
      "TablesBooked",
      "All tables are currently booked. Please try a different time slot or reduce the number of persons."
    );
  }

  // Create a new reservation entry
  const newReservation = {
    _id: new mongoose.Types.ObjectId(),
    tableNumber: tableToBook.tableNumber,
    totalPersons: totalNumberOfPersons,
    date: reservationDateKey,
    time: reservationTime,
    userName: reservationName,
    email,
    phoneNumber
  };

  // Add the new reservation to the time slot
  reservationsForTheTime.push(newReservation);

  // Convert Map to plain object for saving to MongoDB
  restaurantReservations.reservations.set(
    reservationDateKey,
    reservationsForTheDay
  );
  const reservationsObject = Object.fromEntries(
    restaurantReservations.reservations
  );

  // Save the updated reservation document
  const savedReservation = await Reservation.findOneAndUpdate(
    { restaurant: restaurantId },
    { $set: { reservations: reservationsObject } },
    { upsert: true, returnDocument: "after" }
  );

  // Respond with the saved reservation details
  res.json({ ...newReservation, restaurantId });
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

exports.getReservationById = asyncHandler(async (req, res) => {
  const { restaurantId, reservationId, date, time } = req.query;

  const reservationDate = new Date(date);
  reservationDate.setHours(0, 0, 0, 0); // Normalize to midnight local time

  if (isNaN(reservationDate.getTime())) {
    res.status(400);
    throw new CustomError("DateParsingError", "Invalid date provided.");
  }

  let restaurantReservations = await Reservation.findOne({
    restaurant: restaurantId,
  });

  const reservationInGivenDayAndTime =
    restaurantReservations.reservations
      .get(reservationDate.toLocaleDateString())
      .get(time) || [];

  const savedReservation = reservationInGivenDayAndTime.filter(
    (reservation) => {
      return reservation._id.toString() === reservationId;
    }
  );

  if (!reservationInGivenDayAndTime || !savedReservation) {
    res.status(400);
    throw new CustomError("NotFound", "No reservation found!");
  }

  res.json(...savedReservation);
});

exports.getReservationByRestaurantId = asyncHandler(async (req, res) => {
  const { id } = req.token;

  let restaurantReservations = await Reservation.findOne({ restaurant: id });
  let reservations = [];

  restaurantReservations.reservations.forEach((reservationsByDate) => {
    reservationsByDate.forEach((reservationsByTime) => {
      reservations.push(...reservationsByTime);
    });
  });

  res.json(reservations);
});
