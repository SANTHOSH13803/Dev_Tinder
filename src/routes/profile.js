const express = require("express");
const userAuth = require("../middlewares/userAuth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("User Not found");
    }

    res.send(user);
  } catch (error) {
    res.status(500).send("Something went wrong" + error);
  }
});

module.exports = profileRouter;
