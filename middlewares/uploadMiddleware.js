const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure folder exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage
const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `uploads/${folder}`;
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    },
  });

const uploadRecipeImg = multer({
  storage: storage("recipes"),
});


const uploadBlogImg = multer({
  storage: storage("blogs"),
});

const uploadAvatar = multer({
  storage: storage("avatars"),
});

module.exports = { uploadRecipeImg, uploadAvatar, uploadBlogImg };
