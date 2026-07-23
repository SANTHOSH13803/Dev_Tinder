const { Router } = require("express");
const userAuth = require("../middlewares/userAuth");
const { errorResponse, successResponse } = require("../config/messages");
const ChatModel = require("../models/chat");
const { format } = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");
const { checkUserOnline } = require("../utils/socket");
const MessageModel = require("../models/messages");

const chatRouter = Router();

chatRouter.get("/:toUserId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { toUserId } = req.params;

    // check if friend request exists

    const areFriends = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId: userId, toUserId },
        { fromUserId: toUserId, toUserId: userId }
      ],
      status: "accepted"
    });

    if (!areFriends) {
      throw new Error("Connection Request Not found");
    }

    // check if the chat exists

    let prevChat = await ChatModel.findOne({
      participants: { $all: [userId, toUserId] }
    });

    if (!prevChat) {
      prevChat = new ChatModel({
        participants: [userId, toUserId],
        lastMessage: null
      });
      await prevChat.save();
    }

    const isOnline = checkUserOnline(toUserId);

    prevChat = { ...prevChat.toObject(), chatId: prevChat._id, isOnline };

    return successResponse({ res, data: prevChat });
  } catch (error) {
    return errorResponse({ res, error: error.message });
  }
});

chatRouter.get("/:chatId/messages", userAuth, async (req, res) => {
  try {
    const { _id } = req.user;
    const { chatId } = req.params;
    // check if chat exists
    const chat = await ChatModel.findOne({
      _id: chatId,
      participants: { $in: [_id] }
    });
    if (!chat) {
      throw new Error("Not Authorized");
    }

    const response = await MessageModel.find({ chatId })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("senderId", "firstName");

    return successResponse({ res, data: response.reverse() });
  } catch (error) {
    return errorResponse({ res, error: error.message });
  }
});
module.exports = chatRouter;

// old
// chatRouter.get("/:toUserId", userAuth, async (req, res) => {
//   try {
//     const { toUserId } = req.params;
//     const user = req.user;
//     const fromUserId = user?._id;
//     // validtations
//     // i) check if both are friends
//     const isFriends = await ConnectionRequestModel.findOne({
//       $or: [
//         {
//           fromUserId,
//           toUserId
//         },
//         {
//           fromUserId: toUserId,
//           toUserId: fromUserId
//         }
//       ]
//     });

//     if (!isFriends) {
//       throw new Error("Invalid credentials");
//     }

//     let chat = await ChatModel.findOne({
//       participants: { $all: [toUserId, fromUserId] }
//     }).populate({
//       path: "messages.senderId",
//       select: "firstName _id"
//     });

//     if (!chat) {
//       // create a new chat
//       chat = new ChatModel({
//         participants: [toUserId, fromUserId],
//         message: []
//       });
//       await chat.save();
//     }
//     const chatObj = chat.toObject();

//     chatObj["isOnline"] = checkUserOnline(toUserId);
//     chatObj.messages = chatObj.messages.map((each) => {
//       return {
//         message: each.message,
//         senderId: each.senderId._id,
//         id: each._id,
//         createdAt: each.createdAt,
//         time: format(new Date(each.createdAt), "hh:KK aaa")
//       };
//     });
//     return successResponse({ res, data: chatObj });
//   } catch (error) {
//     return errorResponse({ res, error: error.message });
//   }
// });
// old
