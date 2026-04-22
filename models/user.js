const mongoose = require("mongoose");
const validator = require("validator");
const errors = require("../utils/errors");

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
});

module.exports = mongoose.model("user", userSchema);
