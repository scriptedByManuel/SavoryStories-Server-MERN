const mongoose = require("mongoose");
const Chef = require("../models/Chef");

const chefController = {
  getChefById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid chef id" });
      }
      const chef = await Chef.findById(id).select("name avatar bio createdAt");
      if (!chef) {
        return res.status(404).json({ message: "Chef not found" });
      }
      res.status(200).json({ data: chef });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = chefController;
