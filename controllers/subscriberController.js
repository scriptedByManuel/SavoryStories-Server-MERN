const Subscriber = require("../models/Subscriber");

const subscriberController = {
  subscribe: async (req, res) => {
    try {
      const { email } = req.body;
      const exists = await Subscriber.findOne({ email });
      if (exists) {
        return res.status(400).json({
          message: "Email already subscribed",
        });
      }
      const subscriber = await Subscriber.create({ email });
      res
        .status(201)
        .json({ message: "Subscribed successfully", data: subscriber });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = subscriberController;
