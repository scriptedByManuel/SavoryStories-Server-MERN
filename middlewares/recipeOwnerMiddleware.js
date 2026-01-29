const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");

const recipeOwnerMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid recipe id" });
    }
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    req.recipe = recipe;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = recipeOwnerMiddleware;
