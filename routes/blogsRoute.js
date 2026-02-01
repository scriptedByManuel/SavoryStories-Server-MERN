const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyOwnBlogs,
} = require("../controllers/blogsController");
const blogOwnerMiddleware = require("../middlewares/blogOwnerMiddleware");
const blogValidation = require("../validators/blogValidation");
const handleErrorMessage = require("../middlewares/handleErrorMessage");

const router = express.Router();

router.get("", getAllBlogs);
router.get("/my-blogs", authMiddleware, getMyOwnBlogs);
router.get("/:slug", getBlogBySlug);
router.post("", authMiddleware, blogValidation, handleErrorMessage, createBlog);
router.patch(
  "/:id",
  authMiddleware,
  blogValidation,
  handleErrorMessage,
  blogOwnerMiddleware,
  updateBlog,
);
router.delete("/:id", authMiddleware, blogOwnerMiddleware, deleteBlog);

module.exports = router;
