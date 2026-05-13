const User = require("../models/user");
const { errors } = require("../utils/errors");
const { HTTP_STATUS_CODES } = require("../utils/errors");
const bycrypt = require("bcryptjs");

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

const getCurrentUser = (req, res) => {
  const { userId } = req.user._id;
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
  const { name, avatar, email, password } = req.body;
  console.log("Request body:", req.body);
  User.bycrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name: name,
        avatar: avatar,
        email: email,
        password: hashedPassword,
      });
    })
    .then((user) => {
      const [password, ...userWithoutPassword] = user.toObject();
      res.status(HTTP_STATUS_CODES.CREATED).send(userWithoutPassword);
    })
    .catch((error) => {
      console.error(error);
      if (name) {
        if (name.length < 2 || name.length > 30) {
          return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
            message: errors.NAME_ERROR,
          });
        }
      }
      if (error.code === 11000) {
        return res
          .status(HTTP_STATUS_CODES.CONFLICT)
          .send({ message: errors.DUPLICATE_EMAIL });
      }
      if (error.name === "ValidationError") {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .send({ message: errors.USER_VALIDATION_ERROR });
      }

      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: errors.USER_NOT_CREATED });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((token) => {
      res.status(HTTP_STATUS_CODES.OK).send({ token });
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .send({ message: errors.LOGIN_FAILED });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const { userId } = req.user;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(HTTP_STATUS_CODES.OK).send(user))
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .send({ message: errors.USER_NOT_FOUND });
      }
      if (error.name === "ValidationError") {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .send({ message: errors.USER_VALIDATION_ERROR });
      }
      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: errors.USER_NOT_FOUND });
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  login,
  updateUser,
};
