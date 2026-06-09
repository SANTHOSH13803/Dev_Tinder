const express = require("express");
const userAuth = require("../middlewares/userAuth");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

module.exports = requestRouter;
