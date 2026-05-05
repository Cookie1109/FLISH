const { Op } = require("sequelize");
const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const attachDbUser = require("../middleware/attachDbUser");
const { lookupDictionary } = require("../services/dictionary.service");
const { fetchImageUrl } = require("../services/image.service");
const { translateText } = require("../services/translation.service");
const { Flashcard, Topic, LearningProgress } = require("../models");
const { emitAsync, EVENTS } = require("../services/event.emitter");

const router = express.Router();

router.use(authMiddleware, attachDbUser);

router.get("/me", (req, res) => {
  res.json({
    uid: req.user.uid,
    email: req.user.email || null,
    name: req.user.name || null,
  });
});

router.post("/study/flashcards/:id/answer", async (req, res, next) => {
  try {
    const flashcard = await Flashcard.findOne({
      where: { id: req.params.id },
      include: [{ model: Topic, as: "topic", where: { userId: req.dbUser.id } }],
    });

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    const isCorrect = Boolean(req.body?.isCorrect);

    emitAsync(EVENTS.CARD_VIEWED, {
      userId: req.dbUser.id,
      flashcardId: flashcard.id,
    });

    emitAsync(EVENTS.QUIZ_COMPLETED, {
      userId: req.dbUser.id,
      answers: [
        {
          flashcardId: flashcard.id,
          isCorrect,
        },
      ],
    });

    return res.status(202).json({ status: "accepted" });
  } catch (error) {
    return next(error);
  }
});

router.post("/flashcards/:id/view", async (req, res, next) => {
  try {
    const flashcard = await Flashcard.findOne({
      where: { id: req.params.id },
      include: [{ model: Topic, as: "topic", where: { userId: req.dbUser.id } }],
    });

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    emitAsync(EVENTS.CARD_VIEWED, {
      userId: req.dbUser.id,
      flashcardId: flashcard.id,
    });

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

router.post("/flashcards/:id/definition", async (req, res, next) => {
  try {
    const flashcard = await Flashcard.findOne({
      where: { id: req.params.id },
      include: [{ model: Topic, as: "topic", where: { userId: req.dbUser.id } }],
    });

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    const { definition } = req.body;
    if (typeof definition === 'string') {
      await flashcard.update({ definition });
      return res.json({ success: true, definition: flashcard.definition });
    }
    return res.status(400).json({ error: "Invalid definition" });
  } catch (error) {
    return next(error);
  }
});

router.post("/quiz/complete", async (req, res, next) => {
  try {
    const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
    if (!answers.length) {
      return res.status(400).json({ error: "Answers are required" });
    }

    const flashcardIds = answers
      .map((answer) => answer?.flashcardId)
      .filter(Boolean);

    if (!flashcardIds.length) {
      return res.status(400).json({ error: "Flashcard IDs are required" });
    }

    const flashcards = await Flashcard.findAll({
      where: { id: flashcardIds },
      include: [{ model: Topic, as: "topic", where: { userId: req.dbUser.id } }],
    });

    if (flashcards.length !== flashcardIds.length) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    const sanitized = answers.map((answer) => ({
      flashcardId: answer.flashcardId,
      isCorrect: Boolean(answer.isCorrect),
    }));

    emitAsync(EVENTS.QUIZ_COMPLETED, {
      userId: req.dbUser.id,
      answers: sanitized,
    });

    return res.status(202).json({ status: "accepted" });
  } catch (error) {
    return next(error);
  }
});

router.get("/lookup/:word", async (req, res, next) => {
  try {
    const word = req.params.word?.trim();
    if (!word) {
      return res.status(400).json({ error: "Word is required" });
    }

    let dictionaryData = null;
    let imageUrl = null;
    let exampleTranslation = null;

    try {
      dictionaryData = await lookupDictionary(word);
    } catch (error) {
      dictionaryData = null;
    }

    try {
      imageUrl = await fetchImageUrl(word);
    } catch (error) {
      imageUrl = null;
    }

    if (dictionaryData?.exampleSentence) {
      try {
        exampleTranslation = await translateText(dictionaryData.exampleSentence);
      } catch (error) {
        exampleTranslation = null;
      }
    }

    // Dịch từ vựng chính → nghĩa tiếng Việt ngắn gọn
    let viDefinition = null;
    try {
      viDefinition = await translateText(word);
    } catch (e) {}

    if (dictionaryData && viDefinition) {
      dictionaryData.definition = viDefinition;
    } else if (!dictionaryData && viDefinition) {
      // Không tìm được trong dictionary nhưng vẫn dịch được từ
      dictionaryData = { definition: viDefinition };
    }

    return res.json({
      word,
      ...dictionaryData,
      imageUrl,
      exampleTranslation,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const query = req.query.q ? String(req.query.q).trim() : "";
    const limit = Math.min(
      Number.parseInt(req.query.limit, 10) || 10,
      50
    );

    if (!query) {
      return res.json({ results: [] });
    }

    const flashcards = await Flashcard.findAll({
      where: {
        [Op.or]: [
          { word: { [Op.iLike]: `%${query}%` } },
          { definition: { [Op.iLike]: `%${query}%` } },
          { exampleSentence: { [Op.iLike]: `%${query}%` } },
        ],
      },
      include: [
        {
          model: Topic,
          as: "topic",
          where: { userId: req.dbUser.id },
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    });

    const ids = flashcards.map((card) => card.id);
    const progressRows = ids.length
      ? await LearningProgress.findAll({
        where: { userId: req.dbUser.id, flashcardId: ids },
      })
      : [];
    const progressMap = new Map(
      progressRows.map((row) => [row.flashcardId, row])
    );

    const results = flashcards.map((card) => ({
      id: card.id,
      word: card.word,
      definition: card.definition,
      topicId: card.topic?.id,
      topicName: card.topic?.name,
      masteryLevel: progressMap.get(card.id)?.masteryLevel || "new",
    }));

    return res.json({ results });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
