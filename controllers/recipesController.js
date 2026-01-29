const Recipe = require("../models/Recipe");
const Subscriber = require("../models/Subscriber");
const emailQueue = require("../queues/emailQueue");
const createPagination = require("../utils/createPagination");
const deleteImage = require("../utils/deleteImage");

const recipesController = {
  getAllRecipes: async (req, res) => {
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
              { description: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      // Sorting
      const sortOption =
        sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

      // Home page: latest 6 recipes only
      if (home === "true") {
        const recipes = await Recipe.find(filter)
          .populate("author", "name avatar bio")
          .sort({ createdAt: -1 })
          .limit(3);

        return res.status(200).json({ data: recipes });
      }

      const total = await Recipe.countDocuments(filter);
      const lastPage = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const recipes = await Recipe.find(filter)
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
        recipes,
        req
      );

      res.status(200).json({
        data: recipes,
        links: total === 0 ? null : links,
        meta: total === 0 ? null : meta,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getMyOwnRecipes: async (req, res) => {
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
              { description: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      // Sorting
      const sortOption =
        sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

      const total = await Recipe.countDocuments({
        ...filter,
        author: req.user._id,
      });
      const lastPage = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const recipes = await Recipe.find({
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
        recipes,
        req
      );

      res.status(200).json({
        data: recipes,
        links: total === 0 ? null : links,
        meta: total === 0 ? null : meta,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getRecipeBySlug: async (req, res) => {
    try {
      const { slug } = req.params;

      const recipe = await Recipe.findOne({ slug }).populate(
        "author",
        "name avatar bio"
      );
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.status(200).json({ data: recipe });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createRecipe: async (req, res) => {
    try {
      const {
        title,
        description,
        ingredients,
        instructions,
        cookingTime,
        difficulty,
        category,
      } = req.body;
      const recipe = await Recipe.create({
        title,
        description,
        ingredients,
        instructions,
        cookingTime,
        difficulty,
        category,
        author: req.user._id,
      });

      const subscribers = await Subscriber.find({});
      const subscriberEmails = subscribers.map((sub) => sub.email);

     if(subscriberEmails.length > 0) {
       emailQueue.add({
        viewFile: "recipeEmail",
        from: "'Savory Stories' <no-reply@savorystories.com>",
        to: subscriberEmails,
        subject: "New Recipe Published!",
        data: {
          name: req.user.name,
          recipe,
          recipeUrl: `${process.env.CLIENT_URL}/recipes/${recipe.slug}`,
        },
      });
     }

      res.status(201).json({ data: recipe });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateRecipe: async (req, res) => {
    try {
      const recipe = req.recipe;
      Object.assign(recipe, req.body);
      await recipe.save();
      res.status(200).json({ data: recipe });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteRecipe: async (req, res) => {
    try {
      const recipe = req.recipe;
      // delete image from disk
      if (recipe.image) {
        deleteImage(recipe.image);
      }
      await recipe.deleteOne();
      res.status(200).json({ message: "Recipe deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  uploadRecipeImage: async (req, res) => {
    try {
      const recipe = req.recipe;
      if (recipe.image) {
        deleteImage(recipe.image);
      }
      recipe.image = `recipes/${req.file.filename}`;
      await recipe.save();
      res.status(200).json({ data: recipe });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = recipesController;
