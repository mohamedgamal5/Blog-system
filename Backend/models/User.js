const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
      minlength: 5,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "/public/images/user.jpg",
        publicId: null,
      },
    },
    bio: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});

//generate Auth Token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET //{expiresIn:'30d'}
  );
  return token;
};

const User = mongoose.model("User", userSchema);
// validation register
function validationRegisterUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(2).max(100).required(),
    email: joi.string().trim().min(5).max(100).required().email(),
    password: joi.string().trim().min(5).required(),
  });
  return schema.validate(obj);
}
// validation login
function validationLoginUser(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(5).max(100).required().email(),
    password: joi.string().trim().min(5).required(),
  });
  return schema.validate(obj);
}
// validation update user
function validationUpdateUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(2).max(100),
    password: joi.string().trim().min(5),
    bio: joi.string(),
  });
  return schema.validate(obj);
}
module.exports = {
  User,
  validationRegisterUser,
  validationLoginUser,
  validationUpdateUser,
};
