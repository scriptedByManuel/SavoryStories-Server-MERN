const mongoose = require("mongoose");
const Blog = require("../models/Blog");

const blogOwnerMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog id" });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    req.blog = blog;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = blogOwnerMiddleware;
