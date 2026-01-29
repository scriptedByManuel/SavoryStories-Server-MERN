const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    category: {
      type: String,
      trim: true,
    },

    excerpt: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    featuredImage: {
      type: String,
    },

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

blogSchema.pre("save", function () {
  if (!this.isModified("title")) return;

  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
  });
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
