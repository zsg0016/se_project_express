const bycrypt = require("bcryptjs");
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

const getCurrentUser = (req, res) => {
  const userId = req.user && (req.user._id ?? req.user);
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
  bycrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return User.create({
        name: name,
        avatar: avatar,
        email: email,
        password: hashedPassword,
      });
    })
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(HTTP_STATUS_CODES.CREATED).send(userObj);
    })
    .catch((error) => {
      console.error(error);
      if (!email || !password) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
          message: errors.MISSING_FIELDS,
        });
      }
      if (error.message === errors.NAME_ERROR) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
          message: errors.NAME_ERROR,
        });
      }
      if (error.code === 11000) {
        return res
          .status(HTTP_STATUS_CODES.CONFLICT)
          .send({ message: errors.DUPLICATE_EMAIL });
      }
      if (error.name === "ValidationError") {
        if (error.errors && error.errors.name) {
          return res
            .status(HTTP_STATUS_CODES.BAD_REQUEST)
            .send({ message: errors.NAME_ERROR });
        }
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
      if (!email || !password) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({
          message: errors.MISSING_FIELDS,
        });
      }
      return res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .send({ message: errors.LOGIN_FAILED });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user && (req.user._id ?? req.user);
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
