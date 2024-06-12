const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const {
  Post,
  validationCreatePost,
  validationUpdatePost,
} = require("../models/Post");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const { Comment } = require("../models/Comment");
/**-----------------------------------------------
 * @desc    Create New Post
 * @route   /api/posts
 * @method  POST
 * @access  private (only logged user)
 ------------------------------------------------*/
module.exports.createPostCtrl = asyncHandler(async (req, res) => {
  console.log("req.file", req.file);

  // 1. Validation for image
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }
  // 2. Validation for data
  const { error } = validationCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // 3. Upload photo
  const imagePath = path.join(
    __dirname,
    `../public/images/${req.file.filename}`
  );

  const result = await cloudinaryUploadImage(imagePath);

  // 4. Create new post and save it to DB
  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  // 5. Send response to the client
  res.status(201).json(post);

  // 6. Remove image from the server
  fs.unlinkSync(imagePath);
});

/**-----------------------------------------------
 * @desc    Get All Post
 * @route   /api/posts
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;
  if (pageNumber) {
    posts = await Post.find()
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else if (category) {
    posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  }
  res.status(200).json(posts);
});

/**-----------------------------------------------
 * @desc    Get Single Post
 * @route   /api/posts/:id
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getSinglePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("user", ["-password"])
    .populate("comments");
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  res.status(200).json(post);
});

/**-----------------------------------------------
 * @desc    Get Posts Count
 * @route   /api/posts/count
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getPostsCountCtrl = asyncHandler(async (req, res) => {
  const postsCount = await Post.countDocuments();
  res.status(200).json(postsCount);
});

/**-----------------------------------------------
 * @desc    Delete Post
 * @route   /api/posts/:id
 * @method  DELETE
 * @access  private (only admin or owner of the post)
 ------------------------------------------------*/
module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  if (req.user.isAdmin || req.user.id === post.user.toString()) {
    await Post.findByIdAndDelete(req.params.id);

    await cloudinaryRemoveImage(post.image.publicId);
    // Delete comments
    await Comment.deleteMany({ post: post._id });
    res.status(200).json({
      message: "post has been deleted successfully",
      postId: post._id,
    });
  } else {
    res.status(403).json({
      message: "Access denied, forbidden",
    });
  }
});

/**-----------------------------------------------
 * @desc    Update Post
 * @route   /api/posts/:id
 * @method  PUT
 * @access  private (owner of the post)
 ------------------------------------------------*/
module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
  //  1- validation
  const { error } = validationUpdatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // 2- get the post from DB and check if post exist
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  // 3- check if this post belong to logged user
  if (req.user.id !== post.user.toString()) {
    return res.status(403).json({ message: "Access denied, forbidden" });
  }
  //  4- update post
  const updatePost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    },
    { new: true }
  );
  //  5- send response to client
  res.status(200).json({
    updatePost,
  });
});

/**-----------------------------------------------
 * @desc    Update Post Image
 * @route   /api/posts/upload-image/:id
 * @method  PUT
 * @access  private (owner of the post)
 ------------------------------------------------*/
module.exports.updatePostImageCtrl = asyncHandler(async (req, res) => {
  //  1- validation
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }
  // 2- get the post from DB and check if post exist
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  // 3- check if this post belong to logged user
  if (req.user.id !== post.user.toString()) {
    return res.status(403).json({ message: "Access denied, forbidden" });
  }
  //  4- update post image
  await cloudinaryRemoveImage(post.image.publicId);
  // 5- upload new photo
  const imagePath = path.join(
    __dirname,
    `../public/images/${req.file.filename}`
  );
  const result = await cloudinaryUploadImage(imagePath);
  // 6- update image
  const updatePost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      },
    },
    { new: true }
  ).populate("user", ["-password"]);
  //  7- send response to client
  res.status(200).json({
    updatePost,
  });
  //  8- remove image from server
  fs.unlinkSync(imagePath);
});

/**-----------------------------------------------
 * @desc    Toggle like
 * @route   /api/posts/like/:id
 * @method  PUT
 * @access  private (only logged user)
 ------------------------------------------------*/
module.exports.toggleLikeCtrl = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;
  let post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  const isPostLiked = post.likes.find(
    (user) => user.toString() === req.user.id
  );
  if (isPostLiked) {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          likes: req.user.id,
        },
      },
      { new: true }
    );
  } else {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          likes: req.user.id,
        },
      },
      { new: true }
    );
  }
  res.status(200).json({
    post,
  });
});
