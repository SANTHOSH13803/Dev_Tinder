const mongoose = require("mongoose");

const { Schema } = mongoose;

const ChatSchema = new Schema(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }]
    },
    lastMessage: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const ChatModel = mongoose.model("Chat", ChatSchema);

module.exports = ChatModel;
