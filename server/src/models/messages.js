const { Schema, model } = require("mongoose");

const MessagesSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Chat"
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    message: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
MessagesSchema.index({
  chatId: 1,
  createdAt: -1
});
const MessageModel = model("Message", MessagesSchema);

module.exports = MessageModel;
