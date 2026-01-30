const Chef = require("../models/Chef");
const createToken = require("../utils/createToken");

const authController = {
  me: async (req, res) => {
    res.status(200).json({ user: req.user });
  },
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await Chef.register(name, email, password);
      const token = await createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Chef.login(email, password);
      const token = await createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  logout: (req, res) => {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1,
      });

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authController;
