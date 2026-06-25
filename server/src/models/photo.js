const mongoose = require("mongoose");

const { Schema } = mongoose;
const { PHOTO_ALLOWED_FILEDS, pickFields } = require("../utils/fields");
// user id
// url
// timestamps
// public_id //created when using cloudnary, store it
//      needed when deleting
//

const photoSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);
photoSchema.methods.sendSafePhoto = function () {
  const photo = this.toObject();
  return pickFields(photo, PHOTO_ALLOWED_FILEDS);
};
photoSchema.index({ creadtedAt: 1 });
const PhotoModel = mongoose.model("Photo", photoSchema);
module.exports = PhotoModel;
