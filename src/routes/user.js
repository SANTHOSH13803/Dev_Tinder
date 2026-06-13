const express = require("express");
const userAuth = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/request/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingConnectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId", "firstName lastName age skills photoUrl");

    res.status(200).json({ data: pendingConnectionRequests, success: true });
  } catch (error) {
    res.status(400).send(`Error : Something Went wrong - ${error.message}`);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;

    const acceptedConnectionRequest = await ConnectionRequestModel.find({
      status: "accepted",
      $or: [
        {
          fromUserId: loggedInuser._id,
          toUserId: loggedInuser._id
        }
      ]
    })
      .populate("fromUserId", USER_ALLOWED_FIELDS)
      .populate("toUserId", USER_ALLOWED_FIELDS);

    const data = acceptedConnectionRequest.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInuser._id.toString()
      ) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });
    res.json({ data });
  } catch (error) {
    res.status(400).send(`Error : ${error.message}`);
  }
});
module.exports = userRouter;
