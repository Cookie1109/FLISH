const admin = require("../config/firebase");

async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer\s+(.+)$/i);
    const token =
      match?.[1] ||
      req.headers["x-firebase-token"] ||
      req.cookies?.firebase_token;

    if (!token) {
      return next();
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    res.locals.user = decoded;
    return next();
  } catch (error) {
    return next();
  }
}

module.exports = optionalAuth;
