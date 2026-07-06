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
const ConnectionRequestModel = require("../models/connectionRequest");
const PasswordResetModel = require("../models/passwordReset");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User Not found");
    }
    const parsedUser = user.getSafeUser();
    const matches = await ConnectionRequestModel.countDocuments({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
      status: "accepted"
    });

    return successResponse({
      res,
      data: { ...user.toObject(), matches },
      message: "User Found"
    });
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

      let updateUser = await User.findOneAndUpdate({ _id: user._id }, data, {
        returnDocument: "after"
      });
      const parsedUser = await updateUser.getSafeUser();
      return successResponse({
        data: parsedUser,
        res,
        message: "Profile Update successfully"
      });
    } catch (error) {
      return errorResponse({ res, error: error.message });
    }
  }
);
profileRouter.patch("/profile/password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      throw new Error("Invalid credentials");
    }
    const dbTokenCollection = await PasswordResetModel.findOne({ token });
    if (!dbTokenCollection) {
      throw new Error("Invalid Link");
    }
    if (new Date() > dbTokenCollection.expiresAt) {
      throw new Error("Expired Link");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const dbUser = await User.findOneAndUpdate(
      { _id: dbTokenCollection.userId },
      {
        password: hashedPassword
      }
    );
    await dbTokenCollection.deleteOne();
    return successResponse({ res, message: "Password Updated succesfully" });
  } catch (error) {
    return errorResponse({ res, error: error.message });
  }
});
module.exports = profileRouter;
