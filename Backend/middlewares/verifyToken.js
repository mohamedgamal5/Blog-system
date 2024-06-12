const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    //console.log("authToken", authToken);
    //console.log("token", authToken.splite(" "));
    //const token = authToken.splite(" ")[0];

    try {
      const decodedPayload = jwt.verify(authToken, process.env.JWT_SECRET);
      req.user = decodedPayload;
      next();
    } catch (error) {
      return res.status(401).json({ message: "invalid token, access denied" });
    }
  } else {
    return res.status(401).json({ message: "non token, access denied" });
  }
}
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "not allowed, only admin" });
    }
  });
}

function verifyTokenAndOnlyUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "not allowed, only user himself" });
    }
  });
}

function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "not allowed, only user himself or Admin" });
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
};
