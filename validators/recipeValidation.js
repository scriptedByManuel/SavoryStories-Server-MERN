const { body } = require("express-validator");

const recipeValidation = [
  body("title").notEmpty().withMessage("Title is required"),

  body("description").notEmpty().withMessage("Description is required"),

  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("Ingredients must be an array with at least one item"),

  body("ingredients.*").notEmpty().withMessage("Ingredient cannot be empty"),

  body("instructions")
    .isArray({ min: 1 })
    .withMessage("Instructions must be an array with at least one step"),

  body("instructions.*")
    .notEmpty()
    .withMessage("Instruction step cannot be empty"),

  body("cookingTime")
    .isInt({ min: 1 })
    .withMessage("Cooking time must be a positive number"),

  body("difficulty")
    .isIn(["easy", "medium", "hard"])
    .withMessage("Difficulty must be easy, medium, or hard"),

  body("category").notEmpty().withMessage("Category is required"),
];

module.exports = recipeValidation;
