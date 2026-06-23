const express = require("express");
const userAuth = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const { USER_ALLOWED_FIELDS } = require("../utils/fields");
const { toUserDto } = require("../utils/user");
const { errorResponse, successResponse } = require("../config/messages");

const userRouter = express.Router();

userRouter.get("/user/request/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    let pendingConnectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId", USER_ALLOWED_FIELDS);

    pendingConnectionRequests = pendingConnectionRequests.map((each) => ({
      requestId: each._id,
      ...toUserDto(each.fromUserId)
    }));
    return successResponse({ res, data: pendingConnectionRequests });
  } catch (error) {
    return errorResponse({ res, error: error.message, statusCode: 400 });
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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.query?.page || 1;
    const limit = req.query?.limit || 10;
    const skip = (page - 1) * limit;
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        {
          fromUserId: loggedInUser._id
        },
        {
          toUserId: loggedInUser._id
        }
      ]
    }).select({ fromUserId: 1, toUserId: 1 });
    console.log(connectionRequest, "TEST");
    const hideFromFeedIds = new Set();

    connectionRequest.forEach((each) => {
      hideFromFeedIds.add(each.fromUserId.toString());
      hideFromFeedIds.add(each.toUserId.toString());
    });

    const data = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideFromFeedIds) } },
        { _id: { $ne: loggedInUser._id } }
      ]
    })
      .select(USER_ALLOWED_FIELDS)
      .skip(skip)
      .limit(limit);
    res.json({ data: data });
  } catch (error) {
    res.send("Error : " + error.message);
  }
});
module.exports = userRouter;
