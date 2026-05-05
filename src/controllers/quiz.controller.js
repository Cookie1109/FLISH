const { QuizSession, QuizAnswer, Flashcard, Topic, sequelize } = require("../models");
const { emitAsync, EVENTS } = require("../services/event.emitter");

function normalizeAnswer(value) {
  if (!value) return "";
  return String(value).trim();
}

function isAnswerCorrect(answer, word) {
  if (!answer || !word) return false;
  return answer.toLowerCase() === word.toLowerCase();
}

async function startQuiz(req, res, next) {
  try {
    const topic = await Topic.findOne({
      where: { id: req.params.id, userId: req.dbUser.id },
      include: [{ model: Flashcard, as: "flashcards" }],
      order: [[{ model: Flashcard, as: "flashcards" }, "createdAt", "DESC"]],
    });

    if (!topic) {
      const err = new Error("Topic not found");
      err.status = 404;
      throw err;
    }

    if (!topic.flashcards?.length) {
      return res.render("pages/quiz", {
        title: `Quiz · ${topic.name}`,
        topic,
        session: null,
        cards: [],
        message: "No flashcards available for this topic.",
      });
    }

    const session = await QuizSession.create({
      userId: req.dbUser.id,
      topicId: topic.id,
      totalCards: topic.flashcards.length,
      correctCount: 0,
      score: 0,
    });

    return res.render("pages/quiz", {
      title: `Quiz · ${topic.name}`,
      topic,
      session,
      cards: topic.flashcards,
      quizData: {
        sessionId: session.id,
        cards: topic.flashcards.map((card) => ({
          id: card.id,
          definition: card.definition,
          exampleSentence: card.exampleSentence,
          word: card.word,
        })),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function submitAnswer(req, res, next) {
  try {
    const session = await QuizSession.findOne({
      where: { id: req.params.sessionId, userId: req.dbUser.id },
    });

    if (!session) {
      return res.status(404).json({ error: "Quiz session not found" });
    }

    const flashcardId = req.body?.flashcardId;
    if (!flashcardId) {
      return res.status(400).json({ error: "Flashcard ID is required" });
    }

    const flashcard = await Flashcard.findOne({
      where: { id: flashcardId, topicId: session.topicId },
    });

    if (!flashcard) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    const existing = await QuizAnswer.findOne({
      where: { sessionId: session.id, flashcardId },
    });

    if (existing) {
      return res.json({
        status: "already_answered",
        isCorrect: existing.isCorrect,
        correctAnswer: flashcard.word,
      });
    }

    const userAnswer = normalizeAnswer(req.body?.userAnswer);
    const timeTakenMs = Number.parseInt(req.body?.timeTakenMs, 10) || null;
    const isCorrect = isAnswerCorrect(userAnswer, flashcard.word);

    let answeredCount = 0;
    let correctCount = 0;
    let score = 0;
    let completed = false;

    await sequelize.transaction(async (transaction) => {
      await QuizAnswer.create(
        {
          sessionId: session.id,
          flashcardId,
          userAnswer: userAnswer || null,
          isCorrect,
          timeTakenMs,
        },
        { transaction }
      );

      answeredCount = await QuizAnswer.count({
        where: { sessionId: session.id },
        transaction,
      });

      correctCount = await QuizAnswer.count({
        where: { sessionId: session.id, isCorrect: true },
        transaction,
      });

      score = session.totalCards
        ? Math.round((correctCount / session.totalCards) * 100)
        : 0;
      completed = answeredCount >= session.totalCards;

      await session.update(
        {
          correctCount,
          score,
          endedAt: completed ? new Date() : session.endedAt,
        },
        { transaction }
      );
    });

    if (completed) {
      emitAsync(EVENTS.QUIZ_COMPLETED, {
        userId: req.dbUser.id,
        sessionId: session.id,
      });
    }

    return res.json({
      status: "ok",
      isCorrect,
      correctAnswer: flashcard.word,
      answeredCount,
      correctCount,
      totalCards: session.totalCards,
      score,
      completed,
    });
  } catch (error) {
    return next(error);
  }
}

async function showResult(req, res, next) {
  try {
    const session = await QuizSession.findOne({
      where: { id: req.params.sessionId, userId: req.dbUser.id },
      include: [
        {
          model: QuizAnswer,
          as: "answers",
          include: [{ model: Flashcard, as: "flashcard" }],
        },
        {
          model: Topic,
          as: "topic",
        },
      ],
    });

    if (!session) {
      const err = new Error("Quiz session not found");
      err.status = 404;
      throw err;
    }

    const answeredCount = session.answers?.length || 0;
    const correctCount = session.answers?.filter((a) => a.isCorrect).length || 0;
    const score = session.totalCards
      ? Math.round((correctCount / session.totalCards) * 100)
      : 0;

    if (session.totalCards && answeredCount >= session.totalCards && !session.endedAt) {
      await session.update({
        endedAt: new Date(),
        correctCount,
        score,
      });
      emitAsync(EVENTS.QUIZ_COMPLETED, {
        userId: req.dbUser.id,
        sessionId: session.id,
      });
    }

    return res.render("pages/quiz-result", {
      title: "Quiz result",
      session,
      topic: session.topic,
      answers: session.answers || [],
      answeredCount,
      correctCount,
      score,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  startQuiz,
  submitAnswer,
  showResult,
};
