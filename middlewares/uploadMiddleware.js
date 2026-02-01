const multer = require("multer");

const storage = multer.memoryStorage();

const uploadImg = multer({
  storage: storage,
});

module.exports = { uploadImg };