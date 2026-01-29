const jwt = require("jsonwebtoken");
const Chef = require("../models/Chef");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      } else {
          Chef.findById(decodedToken.id).then((user) => {
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
          req.user = user;
          next();
        }).catch((err) => {
          return res.status(500).json({ message: err.message });
        });
      }
    });
  } else {
    return res.status(400).json({ message: "Please provide a token" });
  }
};

module.exports = authMiddleware;
