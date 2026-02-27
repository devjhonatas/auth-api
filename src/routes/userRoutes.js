const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, requireAdmin } = require("../middlewares/auth");

router.get("/me", authenticate, userController.getMe);
router.get("/", authenticate, requireAdmin, userController.getAllUsers);
router.delete("/:id", authenticate, userController.deleteUser);

module.exports = router;
