const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const attachDbUser = require("../middleware/attachDbUser");
const topicController = require("../controllers/topic.controller");
const cardController = require("../controllers/card.controller");
const studyController = require("../controllers/study.controller");

const router = express.Router();

router.use(authMiddleware, attachDbUser);

router.get("/", topicController.listTopics);
router.get("/new", topicController.newTopicForm);
router.post("/", topicController.createTopic);
router.get("/:id", topicController.showTopic);
router.get("/:id/study", studyController.showStudy);
router.get("/:id/edit", topicController.editTopicForm);
router.post("/:id", topicController.updateTopic);
router.post("/:id/delete", topicController.deleteTopic);

router.get("/:id/cards/new", cardController.newCardForm);
router.post("/:id/cards", cardController.createCard);

module.exports = router;
