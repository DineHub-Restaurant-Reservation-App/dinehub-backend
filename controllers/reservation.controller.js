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

  if (dateToReserve <= today) {
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
    console.log(startingTime);

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

  console.log("timeStr:", timeStr);
  const time = new Date(0, 0, 0, hours, minutes);
  return time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// TODO: fix time format
exports.reserveSeat = asyncHandler(async (req, res) => {
  const { restaurantId, totalNumberOfPersons, date, time, reservationName } =
    req.body;

  const reservationDate = new Date(date);

  if (isNaN(reservationDate.getTime())) {
    throw new CustomError("DateParsingError", "Invalid date provided.");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (reservationDate <= today) {
    throw new CustomError(
      "InvalidDate",
      "The reservation date cannot be earlier than today."
    );
  }

  const reservationTime = convertTimeToLocaleTimeString(time);
  console.log("reservationTime: ", reservationTime);
  const reservationDateKey = reservationDate.toLocaleDateString(); // Use locale date string for date key

  const restaurantReservations = await Reservation.findOne({
    restaurant: restaurantId,
  });

  if (!restaurantReservations) {
    throw new CustomError(
      "RestaurantNotFound",
      "Restaurant not available to reserve!"
    );
  }

  if (!restaurantReservations.reservations.has(reservationDateKey)) {
    restaurantReservations.reservations.set(reservationDateKey, new Map());
    // console.log("Creating new Reservation Date Obj", restaurantReservations);
  }

  const reservationsForTheDay =
    restaurantReservations.reservations.get(reservationDateKey);

  if (!reservationsForTheDay.has(reservationTime)) {
    reservationsForTheDay.set(reservationTime, []);
    // console.log("Creating new Reservation Time Obj", reservationTime);
  }

  const reservationsForTheTime = reservationsForTheDay.get(reservationTime);

  const restaurant = await Restaurant.findById(restaurantId);

  const sortedTables = restaurant.seatingArrangements.sort(
    (tableA, tableB) => tableA.capacity - tableB.capacity
  );

  const matchingTablesForReservation = sortedTables.filter(
    (table) => table.capacity >= totalNumberOfPersons
  );

  if (matchingTablesForReservation.length === 0) {
    throw new CustomError(
      "TableNotFoundError",
      "No table available to accommodate the specified number of persons."
    );
  }

  const tableToBook = findTable(
    matchingTablesForReservation,
    reservationsForTheTime,
    totalNumberOfPersons
  );

  if (!tableToBook) {
    throw new CustomError(
      "TablesBooked",
      "All tables are currently booked. Please try a different time slot or reduce the number of persons."
    );
  }

  const newReservation = {
    tableNumber: tableToBook.tableNumber,
    totalPersons: totalNumberOfPersons,
    date: reservationDate,
    time: reservationTime,
    userName: reservationName,
  };

  reservationsForTheTime.push(newReservation);

  restaurantReservations.reservations.set(
    reservationDateKey,
    reservationsForTheDay
  );

  const savedReservation = await restaurantReservations.save();
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
