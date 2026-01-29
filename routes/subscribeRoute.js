const express = require("express");
const { subscribe } = require("../controllers/subscriberController");
const handleErrorMessage = require("../middlewares/handleErrorMessage");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "",
  [body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email")],
  handleErrorMessage,
  subscribe
);

module.exports = router;
