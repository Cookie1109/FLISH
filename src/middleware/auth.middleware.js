const admin = require("../config/firebase");

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer\s+(.+)$/i);
    const token =
      match?.[1] ||
      req.headers["x-firebase-token"] ||
      req.cookies?.firebase_token;

    if (!token) {
      if (req.accepts("html")) {
        return res.redirect("/auth/login");
      }
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    res.locals.user = decoded;
    return next();
  } catch (error) {
    // Token expired or invalid — always redirect HTML clients cleanly to login
    if (req.accepts("html")) {
      res.clearCookie("firebase_token");
      return res.redirect("/auth/login");
    }
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = authMiddleware;
