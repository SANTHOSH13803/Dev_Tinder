const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { validateOnSignUp } = require("../utils/validators");
const User = require("../models/user");
const { errorResponse, successResponse } = require("../config/messages");
const crypto = require("crypto");
const PasswordResetModel = require("../models/passwordReset");
const { sendEmail } = require("../utils/sendEmail");
const isProduction = process.env.NODE_ENV === "production";

const authRouter = express.Router();
authRouter.post("/signup", async (req, res) => {
  const user = req.body;
  try {
    // validtions
    validateOnSignUp(req);
    // Encrypt password
    const hashPassword = await bcrypt.hash(user.password, 10);

    //  creating a new instance
    const newUser = new User({ ...user, password: hashPassword });
    await newUser.save();
    res.status(200).json({
      data: newUser,
      message: "User Created Successfully",
      success: true
    });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    // validtions
    const { emailId, password } = req.body;
    // validate emailId
    if (!validator.isEmail(emailId)) {
      throw new Error("Not a valid email Id");
    }

    //get  Encrypt password from DB
    const dbUser = await User.findOne({ emailId });
    if (!dbUser) {
      throw new Error("Email Not registered");
    }
    // use bcrypt compare method to validate password
    const hashPassword = dbUser?.password;
    const isValidPassword = await dbUser.validatePassword(password);

    if (isValidPassword) {
      // if true send response
      const token = await dbUser.getJwt(); // custom User Method
      res.cookie("token", token, {
        // httpOnly: true,
        // secure: isProduction,
        // sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      res.json({
        data: dbUser,
        success: true
      });
    } else {
      // if false throw error
      throw new Error("Password Entered is not valid");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now())
    })
    .json({ data: "Logged Out successfully", success: true });
});
authRouter.post("/auth/forgot-password", async (req, res) => {
  try {
    const { emailId } = req.body;
    if (!emailId) {
      throw new Error("Enter Email Id");
      return;
    }
    const user = await User.findOne({ emailId });
    if (!user) {
      return successResponse({
        res,
        message:
          "If the mail is registed. We have sent the forgot email. User Not found"
      });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const isPrevReset = await PasswordResetModel.findOne({
      userId: user._id
    });
    if (isPrevReset) {
      isPrevReset.expiresAt = expiresAt;
      isPrevReset.token = token;
      await isPrevReset.save();
    } else {
      const newModel = new PasswordResetModel({
        userId: user._id,
        token,
        expiresAt
      });
      await newModel.save();
    }
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendEmail({
      to: user.emailId,
      subject: "Reset Your Password",
      html: `
    <h2>Reset Password</h2>
    <p>Click the button below to reset your password.</p>

    <a href="${resetLink}"
       style="
         background:#4F46E5;
         color:white;
         padding:12px 20px;
         text-decoration:none;
         border-radius:6px;
       ">
       Reset Password
    </a>

    <p>This link expires in 15 minutes.</p>
  `
    });
    return successResponse({
      res,
      message: "If the mail is registed. We have sent the forgot email"
    });
  } catch (error) {
    return errorResponse({ res, error: error.message });
  }
});
module.exports = authRouter;
