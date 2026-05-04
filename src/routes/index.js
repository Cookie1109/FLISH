const express = require("express");
const authRoutes = require("./auth.routes");
const apiRoutes = require("./api.routes");
const topicRoutes = require("./topic.routes");
const cardRoutes = require("./card.routes");
const authMiddleware = require("../middleware/auth.middleware");
const attachDbUser = require("../middleware/attachDbUser");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/api", apiRoutes);
router.use("/topics", topicRoutes);
router.use("/cards", cardRoutes);

router.get("/", (req, res) => {
  res.render("pages/home", { title: "FLISH" });
});

router.get("/dashboard", authMiddleware, attachDbUser, (req, res) => {
  res.render("pages/dashboard", { title: "Dashboard" });
});

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
