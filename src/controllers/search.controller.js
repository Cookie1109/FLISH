const { Op } = require("sequelize");
const { Flashcard, LearningProgress, Topic } = require("../models");

async function showSearch(req, res, next) {
  try {
    const query = req.query.q ? String(req.query.q).trim() : "";
    let results = [];

    if (query) {
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
        limit: 50,
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

      results = flashcards.map((card) => ({
        ...card.get(),
        topicName: card.topic?.name,
        masteryLevel: progressMap.get(card.id)?.masteryLevel || "new",
      }));
    }

    return res.render("pages/search", {
      title: "Search",
      query,
      results,
      resultCount: results.length,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  showSearch,
};
