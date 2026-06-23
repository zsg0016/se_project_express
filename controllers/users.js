const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { errors } = require("../utils/errors");
const { HTTP_STATUS_CODES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const { NotFoundError } = require("../errors/NotFoundError");
const { BadRequestError } = require("../errors/BadRequestError");
const { ConflictError } = require("../errors/ConflictError");
const { UnauthorizedError } = require("../errors/UnauthorizedError");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(HTTP_STATUS_CODES.OK).send(user))
    .catch((error) => {
      let err;
      if (error.name === "DocumentNotFoundError") {
        err = new NotFoundError(errors.USER_NOT_FOUND);
      }
      if (error.name === "CastError") {
        err = new BadRequestError(errors.INVALID_USER_ID);
      }
      if (err === undefined) err = new Error(errors.INTERNAL_SERVER_ERROR);
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  console.log("Request body:", req.body);
  let err;
  return bycrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        name,
        avatar,
        email,
        password: hashedPassword,
      })
    )
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(HTTP_STATUS_CODES.CREATED).send(userObj);
    })
    .catch((error) => {
      if (!email || !password) {
        err = new BadRequestError(errors.MISSING_FIELDS);
      }
      if (error.message === errors.NAME_ERROR) {
        err = new BadRequestError(errors.NAME_ERROR);
      }
      if (error.code === 11000) {
        err = new ConflictError(errors.DUPLICATE_EMAIL);
      }
      if (error.name === "ValidationError") {
        if (error.errors && error.errors.name) {
          err = new BadRequestError(errors.NAME_ERROR);
        }
        err = new BadRequestError(errors.USER_VALIDATION_ERROR);
      }
      if (err === undefined) err = new Error(errors.USER_NOT_CREATED);
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(HTTP_STATUS_CODES.OK).send({ token });
    })
    .catch(() => {
      let err;
      if (!email || !password) {
        err = new BadRequestError(errors.MISSING_FIELDS);
      }
      if (err === undefined) err = new UnauthorizedError(errors.LOGIN_FAILED);
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(HTTP_STATUS_CODES.OK).send(user))
    .catch((error) => {
      let err;
      if (error.name === "DocumentNotFoundError") {
        err = new NotFoundError(errors.USER_NOT_FOUND);
      }
      if (error.name === "ValidationError") {
        err = new BadRequestError(errors.USER_VALIDATION_ERROR);
      }
      if (err === undefined) err = new Error(errors.USERS_NOT_FOUND);
      next(err);
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateUser,
};
