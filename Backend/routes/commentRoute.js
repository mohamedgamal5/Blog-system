const express = require("express");

const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  createCommentCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
  getAllCommentsCtrl,
} = require("../controllers/commentController");

const router = express.Router();

// /api/comment
router
  .route("/")
  .post(verifyToken, createCommentCtrl)
  .get(verifyTokenAndAdmin, getAllCommentsCtrl);

// /api/comments/:id
router
  .route("/:id")
  .delete(validateObjectId, verifyToken, deleteCommentCtrl)
  .put(validateObjectId, verifyToken, updateCommentCtrl);
module.exports = router;
