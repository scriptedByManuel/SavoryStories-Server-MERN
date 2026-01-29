const fs = require("fs");
const path = require("path");

const deleteImage = (relativePath) => {
  if (!relativePath) return;

  const fullPath = path.join(__dirname, "..", "uploads", relativePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

module.exports = deleteImage;
