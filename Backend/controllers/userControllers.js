const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { User, validationUpdateUser } = require("../models/User");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultiImage,
} = require("../utils/cloudinary");
const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");

/**--------------------------------
 * @desc    Get all user profile
 * @router  /api/users/profile
 * @method  GET
 * @access  private (only admin)
----------------------------------*/

module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(201).json({ users });
});

/**--------------------------------
 * @desc    Get user profile
 * @router  /api/users/profile/:id
 * @method  GET
 * @access  public
----------------------------------*/

module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("posts");
  if (!user) {
    return res.status(404).json({
      message: "message not found",
    });
  }
  res.status(200).json({ user });
});

/**--------------------------------
 * @desc    update user profile
 * @router  /api/users/profile/:id
 * @method  PUT
 * @access  private (only user himself)
----------------------------------*/

module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = validationUpdateUser(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(5);
    req.body.password = await bcrypt.hash(req.body.password, salt, null);
  }
  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true }
  )
    .select("-password")
    .populate("posts");
  res.status(200).json({ updateUser });
});

/**--------------------------------
 * @desc    Get user count
 * @router  /api/users/count
 * @method  GET
 * @access  private (only admin)
----------------------------------*/

module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  res.status(201).json({ usersCount });
});

/**--------------------------------
 * @desc    profile photo upload
 * @router  /api/users/profile/profile-photo-upload
 * @method  POST
 * @access  private (only logged in user)
----------------------------------*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  // 1- validation
  if (!req.file) {
    return res.status(400).json({ message: "no file provided" });
  }
  //2- Get the path to the image
  const imagePath = path.join(
    __dirname,
    `../public/images/${req.file.filename}`
  );
  //3- Upload to cloudinary
  const result = await cloudinaryUploadImage(imagePath);
  //4- Get the user from DB
  const user = await User.findById(req.user.id);
  //5- Delete old profile photo if exist
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  //6- Change the profilePhoto field in the DB
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();
  //7- Send response to client
  res.status(200).json({
    message: "your profile photo message uploaded",
    profilePhoto: { url: result.secure_url, publicId: result.public_id },
  });
  //8- Remove the image from the server
  fs.unlinkSync(imagePath);
});

/**--------------------------------
 * @desc    Delete user profile
 * @router  /api/users/profile/:id
 * @method  DELETE
 * @access  private (only admin or userhimself)
----------------------------------*/

module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  // 1. Get the user from DB
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }
  //@TODO - 2. Get all posts from DB
  const posts = await Post.find({ user: user._id });
  //@TODO - 3. Get the public ids from the posts
  const imagePblicIds = posts?.map((post) => post.image.publicId);
  console.log(`user ${imagePblicIds}`);
  //@TODO - 4. Delete all posts image from cloudinary that belong to this user
  if (imagePblicIds?.length > 0) {
    await cloudinaryRemoveMultiImage(imagePblicIds);
  }
  // 5. Delete the profile picture from cloudinary
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  // 6. Delete user posts & comments
  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });
  // 7. Delete the user himself
  await User.findByIdAndDelete(req.params.id);
  // 8. Send a response to the client
  res.status(200).json({ message: "your profile has been deleted" });
});
