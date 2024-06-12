const express = require("express");
const {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  getUsersCountCtrl,
  profilePhotoUploadCtrl,
  deleteUserProfileCtrl,
} = require("../controllers/userControllers");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const { validationUpdateUser } = require("../models/User");
const photoUpload = require("../middlewares/photoUpload");
const router = express.Router();

// /api/users/profile
// router.get("/getProfiles", getAllUsersCtrl);
router.route("/profile").get(verifyTokenAndAdmin, getAllUsersCtrl);
// /api/users/profile/:id
router
  .route("/profile/:id")
  .get(validateObjectId, getUserProfileCtrl)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfileCtrl)
  .delete(validateObjectId, verifyTokenAndAuthorization, deleteUserProfileCtrl);
// /api/users/deleteProfile/:id
// router
//   .route("/deleteProfile/:id")
//   .get(validateObjectId, verifyTokenAndAuthorization, deleteUserProfileCtrl);

// /api/users/count
router.route("/count").get(verifyTokenAndAdmin, getUsersCountCtrl);

// /api/users/profile/profile-photo-upload
router
  .route("/profile/profile-photo-upload")
  .post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl);
module.exports = router;
