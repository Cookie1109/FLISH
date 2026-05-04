const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const attachDbUser = require("../middleware/attachDbUser");
const cardController = require("../controllers/card.controller");

const router = express.Router();

router.use(authMiddleware, attachDbUser);

router.get("/:id/edit", cardController.editCardForm);
router.post("/:id", cardController.updateCard);
router.post("/:id/delete", cardController.deleteCard);

module.exports = router;
