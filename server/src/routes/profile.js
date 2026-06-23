const express = require("express");
const userAuth = require("../middlewares/userAuth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { successResponse, errorResponse } = require("../config/messages");
const { USER_ALLOWED_FIELDS } = require("../utils/fields");
const upload = require("../config/multer");
const profileRouter = express.Router();
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User Not found");
    }
    const parsedUser = user.getSafeUser();

    return successResponse({ res, data: user, message: "User Found" });
  } catch (error) {
    return errorResponse({ res, error: error.message });
  }
});

profileRouter.patch(
  "/profile/edit",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      const user = req.user;
      const data = req.body;
      // This is basic validation you can write custom validation function
      // write validation for each field based on your case
      const isValidUpdate = Object.keys(data).some((key) =>
        ["emailId", "password"].includes(key)
      );
      if (isValidUpdate) {
        throw new Error("Invalid Edit Request");
      }

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "devtinder-profile"
        });

        data.photoURL = result.secure_url;
      }

      const updateUser = await User.findOneAndUpdate({ _id: user._id }, data, {
        returnDocument: "after"
      });

      res.send(updateUser);
    } catch (error) {
      console.log(error);
      res.status(400).send("Error: " + error.message);
    }
  }
);
profileRouter.patch("/profile/password", async (req, res) => {
  try {
    const { password, emailId } = req.body;

    // check if user Exsits
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("User Not found! Register Now!!");
    }
    // Add a api layer for OPT verification(Haven't learnt at this point implement later)

    // hash the password
    const hashPassword = await bcrypt.hash(password, 10);
    // if user exist verify change password
    const updatedUser = await User.findByIdAndUpdate(user._id, {
      password: hashPassword
    });
    res.status(200).json({
      data: "Password Updated successfully",
      success: true
    });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong " + error.message });
  }
});
module.exports = profileRouter;
