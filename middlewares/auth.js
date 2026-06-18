const jwt = require("jsonwebtoken");
const { errors } = require("../utils/errors");
const { HTTP_STATUS_CODES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    const err = new UnauthorizedError("Authorization required");
    next(err);
    return;
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    const err = new UnauthorizedError("Authorization required");
    next(err);
  }
};
