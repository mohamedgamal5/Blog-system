const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validationRegisterUser,
  validationLoginUser,
} = require("../models/User");
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
/**--------------------------------
 * @desc    Register new user
 * @router  /api/auth/register
 * @method  POST
 * @access  public
----------------------------------*/

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  //validation
  const { error } = validationRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({ email: req.body.email });
  //is user already exists
  if (user) {
    return res.status(400).json({ message: "user already exist" });
  }
  //hash the password
  const salt = await bcrypt.genSalt(5);
  const hashPassword = await bcrypt.hash(req.body.password, salt, null);
  // new user
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword,
  });

  await user.save();
  //  send gmail(verify account)
  const verificationToken = new VerificationToken({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  await verificationToken.save();
  const link = `http://localhost:3000/users/${user._id}/verify/${verificationToken.token}`;
  const htmlTemplate = `<div>
  <p>Click on the link below to verify your email</p>
  <a href="${link}">Verify</a>
</div>`;

  await sendEmail(user.email, "Verify Your Email", htmlTemplate);

  res.status(201).json({
    message: "We sent to you an email, please verify your email address",
  });
});

/**--------------------------------
 * @desc    login user
 * @router  /api/auth/login
 * @method  POST
 * @access  public
----------------------------------*/
module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  //validation
  const { error } = validationLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({ email: req.body.email });
  //is user exists
  if (!user) {
    return res.status(400).json({ message: "invalid email or password" });
  }
  //check the password
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "invalid email or password" });
  }
  //@TODO -sendingemail(verify account if not verefi)
  if (!user.isAccountVerified) {
    res.status(400).json({
      message: "We sent to you an email, please verify your email address",
    });
  }
  // generate token

  const token = user.generateAuthToken();
  // response to client
  res.status(200).json({
    _id: user._id,
    username: user.username,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token,
  });
});

/**-----------------------------------------------
 * @desc    Verify User Account
 * @route   /api/auth/:userId/verify/:token
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.verifyUserAccountCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "invalid link" });
  }

  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });

  if (!verificationToken) {
    return res.status(400).json({ message: "invalid link" });
  }

  user.isAccountVerified = true;
  await user.save();
  await VerificationToken.deleteMany();
  res.status(200).json({ message: "Your account verified" });
});
