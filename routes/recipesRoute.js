const express = require("express");
const {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  uploadRecipeImage,
  getRecipeBySlug,
  getMyOwnRecipes,
} = require("../controllers/recipesController");
const { uploadRecipeImg } = require("../middlewares/uploadMiddleware");
const { body } = require("express-validator");
const recipeValidation = require("../validators/recipeValidation");
const handleErrorMessage = require("../middlewares/handleErrorMessage");
const authMiddleware = require("../middlewares/authMiddleware");
const recipeOwnerMiddleware = require("../middlewares/recipeOwnerMiddleware");

const router = express.Router();

router.get("", getAllRecipes);
router.get("/my-recipes", authMiddleware, getMyOwnRecipes);
router.get("/:slug", getRecipeBySlug);
router.post("", authMiddleware,recipeValidation, handleErrorMessage, createRecipe);
router.patch(
  "/:id",
  authMiddleware,
  recipeValidation,
  handleErrorMessage,
  recipeOwnerMiddleware,
  updateRecipe
);
router.delete("/:id", authMiddleware, recipeOwnerMiddleware, deleteRecipe);
router.post(
  "/:id/image",
  authMiddleware,
  recipeOwnerMiddleware,
  uploadRecipeImg.single("image"),
  body("image").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Image is required");
    }
    if (!req.file.mimetype.startsWith("image/")) {
      throw new Error("File must be an image");
    }
    return true;
  }),
  handleErrorMessage,
  uploadRecipeImage
);

module.exports = router;
