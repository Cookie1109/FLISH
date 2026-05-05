const express = require("express");
const authRoutes = require("./auth.routes");
const apiRoutes = require("./api.routes");
const topicRoutes = require("./topic.routes");
const cardRoutes = require("./card.routes");
const quizRoutes = require("./quiz.routes");
const authMiddleware = require("../middleware/auth.middleware");
const attachDbUser = require("../middleware/attachDbUser");
const searchController = require("../controllers/search.controller");
const dashboardController = require("../controllers/dashboard.controller");
const homeController = require("../controllers/home.controller");
const optionalAuth = require("../middleware/optionalAuth");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/api", apiRoutes);
router.use("/topics", topicRoutes);
router.use("/cards", cardRoutes);
router.use("/", quizRoutes);

router.get("/", optionalAuth, attachDbUser, homeController.showHome);

router.get(
  "/dashboard",
  authMiddleware,
  attachDbUser,
  dashboardController.showDashboard
);

router.get("/search", authMiddleware, attachDbUser, searchController.showSearch);

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
