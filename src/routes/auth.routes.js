const express = require("express");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("pages/login", { title: "Sign In" });
});

router.get("/register", (req, res) => {
  res.render("pages/register", { title: "Create Account" });
});

router.post("/logout", (req, res) => {
  res.status(204).end();
});

module.exports = router;
