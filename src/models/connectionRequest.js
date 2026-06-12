const mongoose = require("mongoose");

const conncectionSchma = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is not a valid status`
      }
    }
  },
  {
    timestamps: true
  }
);
conncectionSchma.index({ fromUserId: 1, toUserId: 1 });

conncectionSchma.pre("save", function () {
  const connection = this;

  if (connection.fromUserId.equals(connection.toUserId)) {
    throw new Error("This is a invalid request! Can't be processed");
  }
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  conncectionSchma
);

module.exports = ConnectionRequestModel;
