const { uploadFile } = require("../utils/supabaseStorage");

const uploadController = {
  upload: async (req, res) => {
    try {
      const file = req.file;
      const path = await uploadFile("general", file);
      const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/general/${path}`;
      res.status(200).json({
        message: "File uploaded to Supabase",
        url: url,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = uploadController;
