const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET, { expiresIn: 24 * 60 * 60 });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized!");
      }

      req.token = decoded;
      next();
    });
  } else {
    res.status(401);
    throw new Error("Invalid token or token is missing!");
  }
};

module.exports = { createToken, verifyToken };
