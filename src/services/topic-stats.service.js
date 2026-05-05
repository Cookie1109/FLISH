const { Op } = require("sequelize");
const { Topic, Flashcard, LearningProgress, sequelize } = require("../models");
const { getTopicAccent, getTopicInitial } = require("./theme.service");

const LEARNED_LEVELS = ["learning", "mastered"];

async function getTopicStats(userId) {
  const topics = await Topic.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });

  if (!topics.length) return [];

  const topicIds = topics.map((topic) => topic.id);

  const totals = await Flashcard.findAll({
    attributes: [
      "topicId",
      [sequelize.fn("COUNT", sequelize.col("id")), "totalCount"],
    ],
    where: { topicId: topicIds },
    group: ["topicId"],
    raw: true,
  });

  const totalsMap = new Map(
    totals.map((row) => [row.topicId, Number(row.totalCount)])
  );

  const learnedRows = await LearningProgress.findAll({
    attributes: [
      [sequelize.col("flashcard.topic_id"), "topicId"],
      [
        sequelize.fn("COUNT", sequelize.col("LearningProgress.id")),
        "learnedCount",
      ],
    ],
    include: [
      {
        model: Flashcard,
        as: "flashcard",
        attributes: [],
        where: { topicId: topicIds },
      },
    ],
    where: {
      userId,
      masteryLevel: { [Op.in]: LEARNED_LEVELS },
    },
    group: ["flashcard.topic_id"],
    raw: true,
  });

  const learnedMap = new Map(
    learnedRows.map((row) => [row.topicId, Number(row.learnedCount)])
  );

  return topics.map((topic) => {
    const totalCount = totalsMap.get(topic.id) || 0;
    const learnedCount = learnedMap.get(topic.id) || 0;
    const progressPercent = totalCount
      ? Math.round((learnedCount / totalCount) * 100)
      : 0;
    const accent = getTopicAccent(topic);

    return {
      ...topic.get(),
      totalCount,
      learnedCount,
      progressPercent,
      accentColor: accent.color,
      accentText: accent.text,
      initial: getTopicInitial(topic),
    };
  });
}

module.exports = {
  getTopicStats,
  LEARNED_LEVELS,
};
