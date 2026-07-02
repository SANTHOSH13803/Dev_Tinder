const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    token: { type: String, required: true },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

const PasswordResetModel = mongoose.model("PasswordReset", passwordResetSchema);
module.exports = PasswordResetModel;
