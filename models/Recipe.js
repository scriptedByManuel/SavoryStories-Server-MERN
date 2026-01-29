const mongoose = require("mongoose");
const slugify = require("slugify");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: { type: String, required: true, trim: true },
    ingredients: { type: [String], required: true },
    instructions: { type: [String], required: true },
    cookingTime: { type: Number },
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    category: { type: String },
    image: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chef",
      required: true,
    },
  },
  { timestamps: true }
);

// Generate slug from title
// Runs only when title is created or changed

recipeSchema.pre("save", function () {
  if (!this.isModified("title")) return;

  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
  });
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
