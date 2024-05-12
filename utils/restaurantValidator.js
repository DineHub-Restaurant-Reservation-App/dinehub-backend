const isAddressValid = (address, res) => {
  const isEmpty =
    address.street &&
    address.city &&
    address.province &&
    address.postalCode &&
    address.coutry;

  if (isEmpty) {
    res.status(400);
    throw new Error("All address fields are mandatory!");
  }

  const isPostalCodeValid = /^[\d\D]{3} [\d\D]{3}$/.test(address.postalCode);

  if (!isPostalCodeValid) {
    res.status(400);
    throw new Error("Invalid postal code format");
  }

  return true;
};

const isBusinessHoursValid = (businessHours, res) => {
  if (businessHours.length !== 7) {
    res.status(400);
    throw new Error("There should be 7 business days data!");
  }

  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

  businessHours.forEach((businessHour, index) => {
    const isStartingTimeValid = timeRegex.test(businessHour.from);
    const isEndingTimeValid = timeRegex.test(businessHour.to);

    if (!isStartingTimeValid || !isEndingTimeValid) {
      res.status(400);
      throw new Error(
        `BusinessHour for day ${
          index + 1
        } of the week is not in 24-hour format!`
      );
    }
  });

  return true;
};

const isSeatingArrangementsValid = (seatingArrangements, res) => {
  if (!seatingArrangements) {
    res.status(400);
    throw new Error("Seating arragements is missing!");
  }

  if (seatingArrangements.length == 0) {
    res.status(400);
    throw new Error("Seating arragements should contain atleast one table!");
  }

  const isAnyTableHavingZeroCapacity = seatingArrangements.some(
    (seat) => seat.capacity === 0
  );

  if (isAnyTableHavingZeroCapacity) {
    res.status(400);
    throw new Error("Table cannot have 0 capacity!");
  }

  return true;
};

exports.isRestaurantDataValid = (data, res) => {
  return (
    data.name &&
    data.phoneNumber &&
    data.url &&
    data.about &&
    data.cuisine &&
    data.slotInterval &&
    isAddressValid(data.address, res) &&
    isBusinessHoursValid(data.businessHours, res) &&
    isSeatingArrangementsValid(data.seatingArrangements, res)
  );
};
