const Blog = require("../models/Blog");
const Subscriber = require("../models/Subscriber");
const emailQueue = require("../queues/emailQueue");
const createPagination = require("../utils/createPagination");
const deleteImage = require("../utils/deleteImage");

const blogsController = {
  getAllBlogs: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const search = req.query.search || "";
      const sort = req.query.sort || "newest";
      const home = req.query.home;

      // Search filter
      const filter = search
        ? {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { content: { $regex: search, $options: "i" } },
              { excerpt: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      // Sorting
      const sortOption =
        sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

      // Home page: latest 6 recipes only
      if (home === "true") {
        const blogs = await Blog.find(filter)
          .populate("author", "name avatar bio")
          .sort({ createdAt: -1 })
          .limit(6);

        return res.status(200).json({ data: blogs });
      }

      const total = await Blog.countDocuments(filter);
      const lastPage = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const blogs = await Blog.find(filter)
        .populate("author", "name avatar bio")
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

      const { links, meta } = createPagination(
        page,
        limit,
        total,
        skip,
        lastPage,
        sort,
        search,
        blogs,
        req
      );

      res.status(200).json({
        data: blogs,
        links: total === 0 ? null : links,
        meta: total === 0 ? null : meta,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getMyOwnBlogs: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const search = req.query.search || "";
      const sort = req.query.sort || "newest";

      // Search filter
      const filter = search
        ? {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { content: { $regex: search, $options: "i" } },
              { excerpt: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      // Sorting
      const sortOption =
        sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

      const total = await Blog.countDocuments({
        ...filter,
        author: req.user._id,
      });
      const lastPage = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const blogs = await Blog.find({
        ...filter,
        author: req.user._id,
      })
        .populate("author", "name avatar bio")
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

      const { links, meta } = createPagination(
        page,
        limit,
        total,
        skip,
        lastPage,
        sort,
        search,
        blogs,
        req
      );

      res.status(200).json({
        data: blogs,
        links: total === 0 ? null : links,
        meta: total === 0 ? null : meta,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getBlogBySlug: async (req, res) => {
    try {
      const { slug } = req.params;

      const blog = await Blog.findOne({ slug }).populate(
        "author",
        "name avatar bio"
      );
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.status(200).json({ data: blog });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createBlog: async (req, res) => {
    try {
      const { title, content, excerpt, category } = req.body;
      const blog = await Blog.create({
        title,
        content,
        excerpt,
        category,
        author: req.user._id,
      })

      const subscribers = await Subscriber.find({});
      const subscriberEmails = subscribers.map((sub) => sub.email);

      if (subscriberEmails.length > 0) {
        emailQueue.add({
          viewFile: "blogEmail",
          from: "'Savory Stories' <no-reply@savorystories.com>",
          to: subscriberEmails,
          subject: "New Blog Published!",
          data: {
            name: req.user.name,
            blog: blog,
            blogUrl: `${process.env.CLIENT_URL}/blogs/${blog.slug}`,
          },
        });
      }

      res.status(201).json({ data: blog });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateBlog: async (req, res) => {
    try {
      const blog = req.blog;
      Object.assign(blog, req.body);
      await blog.save();
      res.status(200).json({ data: blog });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const blog = req.blog;
      // delete image from disk
      if (blog.featuredImage) {
        deleteImage(blog.featuredImage);
      }
      await blog.deleteOne();
      res.status(200).json({ message: "Blog deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  uploadBlogImage: async (req, res) => {
    try {
      const blog = req.blog;
      if (blog.featuredImage) {
        deleteImage(blog.featuredImage);
      }
      blog.featuredImage = `blogs/${req.file.filename}`;
      await blog.save();
      res.status(200).json({ data: blog });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = blogsController;
