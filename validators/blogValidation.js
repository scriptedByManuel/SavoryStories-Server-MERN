const { body } = require("express-validator");

const blogValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("excerpt").notEmpty().withMessage("Excerpt is required"),
  body("content").notEmpty().withMessage("Content is required"),
];

module.exports = blogValidation;
