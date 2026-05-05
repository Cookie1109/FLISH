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

  // 7 days — persists across browser restarts
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  res.cookie("firebase_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SEVEN_DAYS_MS,
  });
  return res.status(204).end();
});

router.all("/logout", (req, res) => {
  res.clearCookie("firebase_token");
  if (req.accepts("html")) {
    return res.redirect("/auth/login");
  }
  return res.status(204).end();
});

module.exports = router;
