const jwt = require("jsonwebtoken");
const { errors } = require("../utils/errors");
const { HTTP_STATUS_CODES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(HTTP_STATUS_CODES.UNAUTHORIZED)
      .send({ message: errors.UNAUTHORIZED });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res
      .status(HTTP_STATUS_CODES.UNAUTHORIZED)
      .send({ message: errors.UNAUTHORIZED });
  }
};
