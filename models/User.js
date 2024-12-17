const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  age: {
    type: Number,
    min: [18, "Age must be at least 18"],
    max: [99, "Age cannot exceed 99"],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
