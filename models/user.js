const mongoose = require("mongoose");
const validator = require("validator");
const bycrypt = require("bcryptjs");
const { errors } = require("../utils/errors");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: errors.INVALID_URL,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: errors.INVALID_EMAIL,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(errors.LOGIN_FAILED));
      }
      return bycrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error(errors.LOGIN_FAILED));
        }
        return user;
      });
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

module.exports = mongoose.model("user", userSchema);
