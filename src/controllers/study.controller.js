const { Flashcard, LearningProgress, Topic } = require("../models");
const { getTopicAccent } = require("../services/theme.service");

function mapProgress(rows) {
  const map = new Map();
  rows.forEach((row) => {
    map.set(row.flashcardId, row);
  });
  return map;
}

function isLearned(level) {
  return level === "learning" || level === "mastered";
}

async function showStudy(req, res, next) {
  try {
    const topic = await Topic.findOne({
      where: { id: req.params.id, userId: req.dbUser.id },
    });

    if (!topic) {
      const err = new Error("Topic not found");
      err.status = 404;
      throw err;
    }

    const flashcards = await Flashcard.findAll({
      where: { topicId: topic.id },
      order: [["createdAt", "DESC"]],
    });

    const progressRows = flashcards.length
      ? await LearningProgress.findAll({
          where: {
            userId: req.dbUser.id,
            flashcardId: flashcards.map((card) => card.id),
          },
        })
      : [];

    const progressMap = mapProgress(progressRows);

    const cards = flashcards.map((card) => {
      const progress = progressMap.get(card.id);
      return {
        id: card.id,
        word: card.word,
        definition: card.definition,
        exampleSentence: card.exampleSentence,
        exampleTranslation: card.exampleTranslation,
        imageUrl: card.imageUrl,
        phonetic: card.phonetic,
        partOfSpeech: card.partOfSpeech,
        masteryLevel: progress?.masteryLevel || "new",
      };
    });

    const learnedCount = cards.filter((card) => isLearned(card.masteryLevel)).length;

    const accent = getTopicAccent(topic);

    return res.render("pages/study", {
      title: `Study · ${topic.name}`,
      topic: { ...topic.get(), accentColor: accent.color },
      totalCount: cards.length,
      learnedCount,
      studyData: {
        topicId: topic.id,
        cards,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  showStudy,
};
