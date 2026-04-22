const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./items");
const errors = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use("*", (req, res) => {
  if (!res.headersSent) {
    res.status(404).send({ message: errors.RESOURCE_NOT_FOUND });
  }
});

module.exports = { router };
