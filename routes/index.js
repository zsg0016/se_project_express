const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./items");
const {errors} = require("../utils/errors");
const {HTTP_STATUS_CODES} = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use("*", (req, res) => {
  if (!res.headersSent) {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).send({ message: errors.RESOURCE_NOT_FOUND });
  }
});

module.exports = { router };
