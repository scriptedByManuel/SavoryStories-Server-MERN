const express = require("express");
const {
  register,
  login,
  logout,
  me,
} = require("../controllers/authController");
const Chef = require("../models/Chef");
const { body } = require("express-validator");
const handleErrorMessage = require("../middlewares/handleErrorMessage");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, me);
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("email").custom(async (value) => {
      const user = await Chef.findOne({ email: value });
      if (user) {
        throw new Error("Account already exists");
      }
    }),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  handleErrorMessage,
  register
);

router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  handleErrorMessage,
  login
);

router.get("/logout", logout);

module.exports = router;
