const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./items");
const { errors } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const { getItems } = require("../controllers/items");
const { NotFoundError } = require("../errors/NotFoundError");

const { validateLoginBody, validateUserBody } = require("../middlewares/valid");

router.post("/signin", validateLoginBody, login);
router.post("/signup", validateUserBody, createUser);
router.get("/items/", getItems);
router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use("*", (req, res, next) => {
  next(new NotFoundError(errors.RESOURCE_NOT_FOUND));
});

module.exports = { router };
