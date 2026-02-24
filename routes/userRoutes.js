const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/users", auth, userController.getUsers);
router.put("/users/:id", auth, admin, userController.updateUser);
router.delete("/users/:id", auth, admin, userController.deleteUser);

module.exports = router;



