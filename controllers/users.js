const User = require("../models/user");
const errors = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ message: errors.USERS_NOT_FOUND });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "User not found" });
      }
      if (error.name === "CastError") {
        return res.status(400).send({ message: error.message });
      }
      return res.status(500).send({ message: errors.USER_NOT_FOUND });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res.status(400).send({ message: error.message });
      }
      if (name) {
        if (name.length < 2 || name.length > 30) {
          return res.status(400).send({
            message: "User name must be between 2 and 30 characters long",
          });
        }
      }

      return res.status(500).send({ message: errors.USER_NOT_CREATED });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
