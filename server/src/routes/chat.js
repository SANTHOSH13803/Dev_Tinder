const { Router } = require("express");
const userAuth = require("../middlewares/userAuth");
const { errorResponse, successResponse } = require("../config/messages");
const ChatModel = require("../models/chat");
const { format } = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");
const { checkUserOnline } = require("../utils/socket");

const chatRouter = Router();

chatRouter.get("/:toUserId", userAuth, async (req, res) => {
  try {
    const { toUserId } = req.params;
    const user = req.user;
    const fromUserId = user?._id;
    // validtations
    // i) check if both are friends
    const isFriends = await ConnectionRequestModel.findOne({
      $or: [
        {
          fromUserId,
          toUserId
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId
        }
      ]
    });

    if (!isFriends) {
      throw new Error("Invalid credentials");
    }

    let chat = await ChatModel.findOne({
      participants: { $all: [toUserId, fromUserId] }
    }).populate({
      path: "messages.senderId",
      select: "firstName _id"
    });

    if (!chat) {
      // create a new chat
      chat = new ChatModel({
        participants: [toUserId, fromUserId],
        message: []
      });
      await chat.save();
    }
    const chatObj = chat.toObject();

    chatObj["isOnline"] = checkUserOnline(toUserId);
    chatObj.messages = chatObj.messages.map((each) => {
      return {
        message: each.message,
        senderId: each.senderId._id,
        id: each._id,
        createdAt: each.createdAt,
        time: format(new Date(each.createdAt), "hh:KK aaa")
      };
    });
    return successResponse({ res, data: chatObj });
  } catch (error) {
    return errorResponse({ res, error: error.message });
  }
});

module.exports = chatRouter;
