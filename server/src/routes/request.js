const express = require("express");
const userAuth = require("../middlewares/userAuth");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");
const { successResponse, errorResponse } = require("../config/messages");

const requestRouter = express.Router();
// interested/ignored request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // this is basic implementation. Valiations not written yet
      const { status, toUserId } = req.params;
      const fromUserId = req.user._id;

      // Valiations
      // 1. if toUserId is valid(ie exists in our db)
      // 2. if connection request already exists (to -> from or from-> to)
      // 3. from -> from invalid connction request
      // 4. interested and ignored status should only be allowed

      if (!["interested", "ignored"].includes(status)) {
        return res.status(400).json({
          error: `Error : Not a valid status - ${status}`
        });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          error: `Error : Not a valid conneciton request`
        });
      }

      const existingConnection = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId }
        ]
      });

      if (existingConnection) {
        return res.status(400).json({
          error: `Error : Connection Request Already exist`
        });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status
      });

      const newConncection = await connectionRequest.save();

      return successResponse({
        data: newConncection,
        res
      });
    } catch (error) {
      return errorResponse({ res, error: error.message, statusCode: 400 });
    }
  }
);
// accepted / rejected request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      // Validations
      // status should be accepted or rejected
      // Connection requset is there
      // toUserId = loggedInUserId, status interested

      const allowedRequests = ["accepted", "rejected"];
      if (!allowedRequests.includes(status)) {
        return res.status(400).json({ message: "Invalid status type" });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        toUserId: loggedInUser._id,
        _id: requestId,
        status: "interested"
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Not found" });
      }

      connectionRequest.status = status;
      let data = await connectionRequest.save();

      res.status(200).json({ message: `Connection Request ${status}`, data });
    } catch (error) {
      res.status(400).json({
        error: "Something Went wrong : " + error.message,
        success: false
      });
    }
  }
);

module.exports = requestRouter;
