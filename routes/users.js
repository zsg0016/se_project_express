const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getUsers,
  getCurrentUser,
  createUser,
  login,
  updateUser,
} = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/", auth, getUsers);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);

module.exports = router;
