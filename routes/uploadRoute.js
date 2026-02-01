const express = require("express");
const { upload } = require("../controllers/uploadController");
const { check } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
const handleErrorMessage = require("../middlewares/handleErrorMessage");
const { uploadImg } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post(
  "",
  authMiddleware,
  uploadImg.single("image"),
  check("image").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Image is required");
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new Error("Only JPEG, PNG and WEBP images are allowed");
    }

    return true;
  }),
  handleErrorMessage,
  upload,
);

module.exports = router;
