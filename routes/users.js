const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getUsers,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.get("/", auth, getUsers);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);

module.exports = router;
