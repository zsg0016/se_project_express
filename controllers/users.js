const User = require("../models/user");
const { errors } = require("../utils/errors");
const { HTTP_STATUS_CODES } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_CODES.OK).send(users))
    .catch((error) => {
      console.error(error);
      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: errors.USERS_NOT_FOUND });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(HTTP_STATUS_CODES.OK).send(user);
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .send({ message: errors.USER_NOT_FOUND });
      }
      if (error.name === "CastError") {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .send({ message: errors.INVALID_USER_ID });
      }
      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: errors.USER_NOT_FOUND });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(HTTP_STATUS_CODES.CREATED).send(user))
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .send({ message: errors.USER_VALIDATION_ERROR });
      }
      if (name) {
        if (name.length < 2 || name.length > 30) {
          return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
            message: errors.NAME_ERROR,
          });
        }
      }

      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: errors.USER_NOT_CREATED });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
