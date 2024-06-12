const express = require("express");
const {
  registerUserCtrl,
  loginUserCtrl,
  verifyUserAccountCtrl,
} = require("../controllers/authControllers");
const router = express.Router();

//
router.post("/register", registerUserCtrl);
//
router.post("/login", loginUserCtrl);

//api/auth/:userId/verify/:token
router.get("/:userId/verify/:token", verifyUserAccountCtrl);

module.exports = router;
