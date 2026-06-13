const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;
const validator = require("validator");
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: String,
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Email Not valid : " + value);
      }
    },
    password: {
      type: String,
      unique: true,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong Password" + value);
        }
      }
    },
    age: Number,
    gender: String,
    about: { type: String, default: "This is a demo about!" },
    // array of string
    skills: { type: [String] },
    photoURL: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL" + value);
        }
      }
    }
  },
  {
    timestamps: true
  }
);

// userSchema.index({ emailId: 1 });

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@TINDER123", {
    expiresIn: "1d"
  });

  return token;
};
userSchema.methods.validatePassword = async function (password) {
  const user = this;

  const isValidPassword = await bcrypt.compare(password, user.password);

  return isValidPassword;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
