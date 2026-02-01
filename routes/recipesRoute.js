const express = require("express");
const {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeBySlug,
  getMyOwnRecipes,
} = require("../controllers/recipesController");
const recipeValidation = require("../validators/recipeValidation");
const handleErrorMessage = require("../middlewares/handleErrorMessage");
const authMiddleware = require("../middlewares/authMiddleware");
const recipeOwnerMiddleware = require("../middlewares/recipeOwnerMiddleware");

const router = express.Router();

router.get("", getAllRecipes);
router.get("/my-recipes", authMiddleware, getMyOwnRecipes);
router.get("/:slug", getRecipeBySlug);
router.post(
  "",
  authMiddleware,
  recipeValidation,
  handleErrorMessage,
  createRecipe,
);
router.patch(
  "/:id",
  authMiddleware,
  recipeValidation,
  handleErrorMessage,
  recipeOwnerMiddleware,
  updateRecipe,
);
router.delete("/:id", authMiddleware, recipeOwnerMiddleware, deleteRecipe);

module.exports = router;
