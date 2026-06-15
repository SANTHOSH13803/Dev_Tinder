const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("Session Expired");
    }

    const decodedToken = jwt.verify(token, "DEV@TINDER123");

    const { _id } = decodedToken;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("Session Expired - user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Something went wrong : " + error.message);
  }
};

module.exports = userAuth;
