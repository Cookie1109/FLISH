const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const attachDbUser = require("../middleware/attachDbUser");
const { lookupDictionary } = require("../services/dictionary.service");
const { fetchImageUrl } = require("../services/image.service");
const { translateText } = require("../services/translation.service");
const { Flashcard, Topic } = require("../models");
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

module.exports = router;
