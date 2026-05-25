const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: String,
  emailId: { type: String, required: true, unique: true },
  password: String,
  age: Number,
  gender: String,
  about: { type: String, default: "This is a demo about!" },
  // array of string
  skills: { type: [String], default: "Demo Skill" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
