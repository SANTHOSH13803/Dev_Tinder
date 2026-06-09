const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { validateOnSignUp } = require("../utils/validators");
const User = require("../models/user");

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
    res.send("User created");
  } catch (error) {
    res.status(500).send("Something went wrong : " + error);
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
      res.cookie("token", token);
      res.send("Logged In successfully");
    } else {
      // if false throw error
      throw new Error("Password Entered is not valid");
    }
  } catch (error) {
    res.status(500).send("Something went wrong : " + error);
  }
});
module.exports = authRouter;
