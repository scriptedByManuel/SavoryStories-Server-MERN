const express = require("express");
const { body } = require("express-validator");
const handleErrorMessage = require("../middlewares/handleErrorMessage");
const {
  getProfileInfo,
  updateProfile,
  updatePassword,
  deleteAccount,
} = require("../controllers/profileController");

const router = express.Router();

router.get("", getProfileInfo);
router.delete("/delete-account", deleteAccount);
router.patch(
  "",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("bio").notEmpty().withMessage("Bio is required"),
    body("avatar").notEmpty().withMessage("Avatar is required"),
  ],
  handleErrorMessage,
  updateProfile,
);
router.patch(
  "/password",
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ],
  handleErrorMessage,
  updatePassword,
);

module.exports = router;
