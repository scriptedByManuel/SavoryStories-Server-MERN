const express = require("express");
const { body } = require("express-validator");
const handleErrorMessage = require("../middlewares/handleErrorMessage");
const {
  getProfileInfo,
  updateNameAndBio,
  updatePassword,
  updateAvatar,
  deleteAccount,
} = require("../controllers/profileController");
const { uploadAvatar } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("", getProfileInfo);
router.delete("/delete-account", deleteAccount);
router.patch(
  "",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("bio").notEmpty().withMessage("Bio is required"),
  ],
  handleErrorMessage,
  updateNameAndBio,
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
router.post(
  "/avatar",
  uploadAvatar.single("avatar"),
  body("avatar").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Avatar is required");
    }
    if (!req.file.mimetype.startsWith("image/")) {
      throw new Error("File must be an image");
    }
    return true;
  }),
  handleErrorMessage,
  updateAvatar,
);

module.exports = router;
