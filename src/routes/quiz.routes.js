const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const attachDbUser = require("../middleware/attachDbUser");
const quizController = require("../controllers/quiz.controller");

const router = express.Router();

router.use(authMiddleware, attachDbUser);

router.get("/topics/:id/quiz", quizController.startQuiz);
router.post("/quiz/:sessionId/answer", quizController.submitAnswer);
router.get("/quiz/:sessionId/result", quizController.showResult);

module.exports = router;
