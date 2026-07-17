const mongoose = require("mongoose");

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    message: {
      type: String,
      required: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  { timestamps: true }
);

const ChatSchema = new Schema(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }]
    },
    messages: [messageSchema]
  },
  { timestamps: true }
);

const ChatModel = mongoose.model("Chat", ChatSchema);

module.exports = ChatModel;
