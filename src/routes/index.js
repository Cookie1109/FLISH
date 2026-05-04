const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/home", { title: "FLISH" });
});

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
