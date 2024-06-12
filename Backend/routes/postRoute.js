const express = require("express");
const {
  verifyToken,
  verifyTokenAndOnlyUser,
} = require("../middlewares/verifyToken");
const {
  createPostCtrl,
  getAllPostsCtrl,
  getSinglePostCtrl,
  getPostsCountCtrl,
  deletePostCtrl,
  updatePostCtrl,
  updatePostImageCtrl,
  toggleLikeCtrl,
} = require("../controllers/postControllers");
const photoUpload = require("../middlewares/photoUpload");
const validateObjectId = require("../middlewares/validateObjectId");
const router = express.Router();

//
router
  .route("/")
  .post(verifyToken, photoUpload.single("image"), createPostCtrl)
  .get(getAllPostsCtrl);

//
router.route("/count").get(getPostsCountCtrl);
//
router
  .route("/:id")
  .get(validateObjectId, getSinglePostCtrl)
  .put(validateObjectId, verifyToken, updatePostCtrl)
  .delete(validateObjectId, verifyToken, deletePostCtrl);

router
  .route("/update-image/:id")
  .put(
    validateObjectId,
    verifyToken,
    photoUpload.single("image"),
    updatePostImageCtrl
  );

//  /like/:id
router.route("/like/:id").put(validateObjectId, verifyToken, toggleLikeCtrl);
module.exports = router;
