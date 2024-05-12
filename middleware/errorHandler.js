const { constants: HTTP_RESPONSE } = require("../utils/constants");

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode || HTTP_RESPONSE.SERVER_ERROR;
  let message = "An unkown error";

  console.log(err);

  switch (err.name) {
    case "CastError": {
      const field = err.path;
      const kind = err.reason.kind;

      statusCode = HTTP_RESPONSE.VALIDATION_ERROR;

      if (
        kind === "Number" ||
        kind === "Date" ||
        kind === "String" ||
        kind === "Boolean"
      ) {
        message = `${field} must be a valid ${kind.toLowerCase()}`;
      } else {
        message = `Invalid value provided for ${field}`;
      }
      break;
    }

    default: {
      message = err.message;
    }
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
