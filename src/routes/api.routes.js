const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    uid: req.user.uid,
    email: req.user.email || null,
    name: req.user.name || null,
  });
});

module.exports = router;
