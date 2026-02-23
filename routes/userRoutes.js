const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/users", auth, userController.getUsers);
router.delete("/users/:id", auth, userController.deleteUser);

module.exports = router;



