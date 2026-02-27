const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const { authenticate } = require("../middlewares/auth");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: { error: "Muitas tentativas de login. Tente novamente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authController.register);
router.post("/login", loginLimiter, authController.login);
router.patch("/change-password", authenticate, authController.changePassword);

module.exports = router;
