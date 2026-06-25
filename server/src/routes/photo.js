const express = require("express");
const userAuth = require("../middlewares/userAuth");
const { errorResponse, successResponse } = require("../config/messages");
const upload = require("../config/multer");
const cloudinary = require("../config/cloudinary");
const PhotoModel = require("../models/photo");
const photoRouter = express.Router();

photoRouter.post(
  "/save",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { _id: userId } = req.user;
      const file = req.file;
      console.log(file, "FILE");
      if (!file) {
        return errorResponse({
          res,
          statusCode: 400,
          error: "Photo URL required"
        });
      }
      const cloudRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "devtinder-profile"
      });
      if (!cloudRes) {
        errorResponse({ res, message: "Unable to upload" });
      }
      const newPhoto = await PhotoModel.create({
        userId,
        url: cloudRes.url,
        publicId: cloudRes.public_id
      });

      return successResponse({ res, message: "Photo Save successfully" });
    } catch (error) {
      return errorResponse({ res, error: error.message, statusCode: 400 });
    }
  }
);
photoRouter.get("/", userAuth, async (req, res) => {
  try {
    const userId = req.user?._id;
    let photos = await PhotoModel.find({
      userId
    }).sort({ createdAt: -1 });
    photos = photos.map((photo) => photo.sendSafePhoto());
    return successResponse({ res, data: photos });
  } catch (error) {
    return errorResponse({ res, error: error.message });
  }
});

photoRouter.delete("/delete/:photoId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { photoId } = req.params;

    const actualPhoto = await PhotoModel.findOne({
      userId,
      _id: photoId
    });

    if (!actualPhoto) {
      return errorResponse({ res, error: "Photo Not found" });
    }
    await cloudinary.uploader.destroy(actualPhoto.publicId);
    await actualPhoto.deleteOne();
    return successResponse({ res, message: "Photo Deleted Succesfully" });
  } catch (error) {
    return errorResponse({ res, error: error.message });
  }
});

module.exports = photoRouter;
