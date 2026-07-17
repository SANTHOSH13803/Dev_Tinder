const { Router } = require("express");
const userAuth = require("../middlewares/userAuth");
const { errorResponse, successResponse } = require("../config/messages");
const ChatModel = require("../models/chat");
const { format } = require("date-fns");

const chatRouter = Router();

chatRouter.get("/:toUserId", userAuth, async (req, res) => {
  try {
    const { toUserId } = req.params;
    const user = req.user;
    const fromUserId = user?._id;

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
