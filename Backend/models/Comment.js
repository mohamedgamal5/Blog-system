const mongoose = require("mongoose");
const joi = require("joi");

// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

// Validate Create Comment
function validationCreateComment(obj) {
  const schema = joi.object({
    post: joi.string().required().label("Post"),
    text: joi.string().trim().required().label("Text"),
  });
  return schema.validate(obj);
}

// Validate Update Comment
function validationUpdateComment(obj) {
  const schema = joi.object({
    text: joi.string().trim().required(),
  });
  return schema.validate(obj);
}

module.exports = {
  Comment,
  validationCreateComment,
  validationUpdateComment,
};
