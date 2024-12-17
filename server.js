const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const app = express();

const DB_URL = process.env.MONGO_URI;
mongoose
  .connect(DB_URL, { connectTimeoutMS: 60000 }) // Extended timeout
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.get("/favicon.png", (req, res) => {
  res.status(204).end(); // Respond with 'No Content'
});

app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// app.put("/users/:id", async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedUser) return res.status(404).send("User not found");
//     res.json(updatedUser);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.delete("/users/:id", async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);
//     if (!deletedUser) return res.status(404).send("User not found");
//     res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
module.exports = app;
