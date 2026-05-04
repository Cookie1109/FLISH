const express = require("express");
const authRoutes = require("./auth.routes");
const apiRoutes = require("./api.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/api", apiRoutes);

router.get("/", (req, res) => {
  res.render("pages/home", { title: "FLISH" });
});

router.get("/dashboard", (req, res) => {
  res.render("pages/dashboard", { title: "Dashboard" });
});

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
