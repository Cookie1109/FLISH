const express = require("express");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("pages/login", { title: "Sign In" });
});

router.get("/register", (req, res) => {
  res.render("pages/register", { title: "Create Account" });
});

router.post("/session", (req, res) => {
  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ error: "Token required" });
  }

  res.cookie("firebase_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(204).end();
});

router.post("/logout", (req, res) => {
  res.clearCookie("firebase_token");
  res.status(204).end();
});

module.exports = router;
