const Chef = require("../models/Chef");
const Recipe = require("../models/Recipe");
const Blog = require("../models/Blog");
const bcrypt = require("bcrypt");
const deleteImage = require("../utils/deleteImage");

const profileController = {
  updatePassword: async (req, res) => {
    try {
      const chefId = req.user._id;
      const { currentPassword, newPassword } = req.body;
      const chef = await Chef.findById(chefId).select("+password");
      if (!chef) {
        return res.status(404).json({ message: "Chef not found" });
      }
      const isMatch = await bcrypt.compare(currentPassword, chef.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      if (currentPassword === newPassword) {
        return res.status(400).json({
          message: "New password must be different from current password",
        });
      }
      chef.password = newPassword;
      await chef.save();
      res.status(200).json({
        message: "Password updated successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateNameAndBio: async (req, res) => {
    try {
      const chefId = req.user._id;
      const { name, bio } = req.body;
      const updatedChef = await Chef.findByIdAndUpdate(
        chefId,
        { name, bio },
        { new: true, runValidators: true },
      );
      res
        .status(200)
        .json({ message: "Profile updated successfully", data: updatedChef });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateAvatar: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const chef = req.user;
      if (chef.avatar) {
        deleteImage(chef.avatar);
      }
      chef.avatar = `avatars/${req.file.filename}`;
      await chef.save();
      res
        .status(200)
        .json({ message: "Avatar uploaded successfully", data: chef });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProfileInfo: async (req, res) => {
    try {
      const chef = req.user;
      const chefInfo = {
        _id: chef._id,
        name: chef.name,
        email: chef.email,
        avatar: chef.avatar,
        bio: chef.bio,
        createdAt: chef.createdAt,
      };
      res.status(200).json({
        data: chefInfo,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const chefId = req.user._id;
      const chef = req.user;

      if (chef.avatar) {
        deleteImage(chef.avatar);
      }

      const recipes = await Recipe.find({ author: chefId });
      recipes.forEach((recipe) => {
        if (recipe.image) {
          deleteImage(recipe.image);
        }
      });
      await Recipe.deleteMany({ author: chefId });

      const blogs = await Blog.find({ author: chefId });
      blogs.forEach((blog) => {
        if (blog.image) {
          deleteImage(blog.featuredImage);
        }
      });
      await Blog.deleteMany({ author: chefId });

      await Chef.findByIdAndDelete(chefId);

      res
        .status(200)
        .json({
          message: "Account and all associated media deleted successfully",
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = profileController;
