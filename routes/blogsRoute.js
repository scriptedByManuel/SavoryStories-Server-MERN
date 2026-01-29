const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
  getMyOwnBlogs,
} = require("../controllers/blogsController");
const blogOwnerMiddleware = require("../middlewares/blogOwnerMiddleware");
const { uploadBlogImg } = require("../middlewares/uploadMiddleware");
const { body } = require("express-validator");
const blogValidation = require("../validators/blogValidation");
const handleErrorMessage = require("../middlewares/handleErrorMessage");

const router = express.Router();

router.get("", getAllBlogs);
router.get("/my-blogs", authMiddleware, getMyOwnBlogs);
router.get("/:slug", getBlogBySlug);
router.post("", authMiddleware, blogValidation, handleErrorMessage, createBlog);
router.patch("/:id", authMiddleware, blogValidation, handleErrorMessage, blogOwnerMiddleware, updateBlog);
router.delete("/:id", authMiddleware, blogOwnerMiddleware, deleteBlog);
router.post(
  "/:id/image",
  authMiddleware,
  blogOwnerMiddleware,
  uploadBlogImg.single("image"),
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
  uploadBlogImage
);

module.exports = router;
