require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoute = require("./routes/authRoute");
const recipesRoute = require("./routes/recipesRoute");
const blogsRoute = require("./routes/blogsRoute");
const profileRoute = require("./routes/profileRoute");
const subscribeRoute = require("./routes/subscribeRoute");
const chefRoute = require("./routes/chefRoute");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/authMiddleware");

// Create the app instance
const app = express();

// Logging
app.use(morgan("dev"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: [
      "https://savory-stories-client-mern.vercel.app/",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use("/uploads", express.static("uploads"));

// Cookie parser
app.use(cookieParser());

// view engine setup
app.set("views", "./views");
app.set("view engine", "ejs");

// Routes
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to Savory Stories",
  });
});

// Auth Route
app.use("/api/auth", authRoute);

// Recipes Route
app.use("/api/recipes", recipesRoute);

// Blogs Route
app.use("/api/blogs", blogsRoute);

// Profile Route
app.use("/api/profile", authMiddleware, profileRoute);

// Subscriber Route
app.use("/api/subscribe", subscribeRoute);

// Chef Route
app.use("/api/chef", chefRoute);

module.exports = app;
