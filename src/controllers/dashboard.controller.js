const { Op, fn, col } = require("sequelize");
const {
  Topic,
  Flashcard,
  LearningProgress,
  QuizSession,
  QuizAnswer,
  sequelize,
} = require("../models");

const LEARNED_LEVELS = ["learning", "mastered"];
const REVIEW_LEVELS = ["review", "struggling"];

function mapProgressRow(row) {
  const card = row.flashcard;
  if (!card) return null;
  return {
    id: card.id,
    word: card.word,
    definition: card.definition,
    topicId: card.topic?.id,
    topicName: card.topic?.name,
    masteryLevel: row.masteryLevel,
    lastReviewedAt: row.lastReviewedAt,
  };
}

async function showDashboard(req, res, next) {
  try {
    const userId = req.dbUser.id;

    const topicCount = await Topic.count({ where: { userId } });

    const totalCards = await Flashcard.count({
      include: [
        {
          model: Topic,
          as: "topic",
          where: { userId },
        },
      ],
      distinct: true,
    });

    const learnedCount = await LearningProgress.count({
      where: {
        userId,
        masteryLevel: { [Op.in]: LEARNED_LEVELS },
      },
      include: [
        {
          model: Flashcard,
          as: "flashcard",
          attributes: [],
          include: [
            {
              model: Topic,
              as: "topic",
              attributes: [],
              where: { userId },
            },
          ],
        },
      ],
      distinct: true,
    });

    const reviewCount = await LearningProgress.count({
      where: {
        userId,
        masteryLevel: { [Op.in]: REVIEW_LEVELS },
      },
      include: [
        {
          model: Flashcard,
          as: "flashcard",
          attributes: [],
          include: [
            {
              model: Topic,
              as: "topic",
              attributes: [],
              where: { userId },
            },
          ],
        },
      ],
      distinct: true,
    });

    const unlearnedCount = Math.max(totalCards - learnedCount, 0);

    const totalSessions = await QuizSession.count({ where: { userId } });

    const avgScoreRow = await QuizSession.findAll({
      attributes: [[fn("AVG", col("score")), "avgScore"]],
      where: { userId },
      raw: true,
    });
    const avgScore = Math.round(Number(avgScoreRow[0]?.avgScore || 0));

    const totalAnswers = await QuizAnswer.count({
      include: [
        {
          model: QuizSession,
          as: "session",
          where: { userId },
          attributes: [],
        },
      ],
      distinct: true,
    });

    const correctAnswers = await QuizAnswer.count({
      where: { isCorrect: true },
      include: [
        {
          model: QuizSession,
          as: "session",
          where: { userId },
          attributes: [],
        },
      ],
      distinct: true,
    });

    const accuracy = totalAnswers
      ? Math.round((correctAnswers / totalAnswers) * 100)
      : 0;

    const learnedRows = await LearningProgress.findAll({
      where: { userId, masteryLevel: { [Op.in]: LEARNED_LEVELS } },
      include: [
        {
          model: Flashcard,
          as: "flashcard",
          include: [{ model: Topic, as: "topic", where: { userId } }],
        },
      ],
      order: [["lastReviewedAt", "DESC"]],
      limit: 10,
    });

    const learnedList = learnedRows
      .map(mapProgressRow)
      .filter(Boolean);

    const reviewRows = await LearningProgress.findAll({
      where: { userId, masteryLevel: { [Op.in]: REVIEW_LEVELS } },
      include: [
        {
          model: Flashcard,
          as: "flashcard",
          include: [{ model: Topic, as: "topic", where: { userId } }],
        },
      ],
      order: [["lastReviewedAt", "ASC"]],
      limit: 10,
    });

    const reviewList = reviewRows
      .map(mapProgressRow)
      .filter(Boolean);

    const learnedIdsRows = await LearningProgress.findAll({
      where: { userId, masteryLevel: { [Op.in]: LEARNED_LEVELS } },
      attributes: ["flashcardId"],
      raw: true,
    });
    const learnedIds = learnedIdsRows.map((row) => row.flashcardId);

    const unlearnedCards = await Flashcard.findAll({
      where: learnedIds.length ? { id: { [Op.notIn]: learnedIds } } : {},
      include: [{ model: Topic, as: "topic", where: { userId } }],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    const unlearnedList = unlearnedCards.map((card) => ({
      id: card.id,
      word: card.word,
      definition: card.definition,
      topicId: card.topic?.id,
      topicName: card.topic?.name,
      masteryLevel: "new",
    }));

    return res.render("pages/dashboard", {
      title: "Dashboard",
      stats: {
        topicCount,
        totalCards,
        learnedCount,
        unlearnedCount,
        reviewCount,
        totalSessions,
        avgScore,
        accuracy,
      },
      learnedList,
      unlearnedList,
      reviewList,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  showDashboard,
};
