const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// MongoDB connection
const DB_URL = process.env.MONGO_URI;
mongoose
  .connect(DB_URL, {
    maxPoolSize: 10, // Optimized connection pooling for serverless
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const User = require("./models/User");

// Fetch users with pagination
app.get("/users", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default page=1, limit=10
  try {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new user
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Export app for serverless
module.exports = app;
