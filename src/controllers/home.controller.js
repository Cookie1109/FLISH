const { getTopicStats } = require("../services/topic-stats.service");

async function showHome(req, res, next) {
  try {
    if (!req.dbUser) {
      return res.render("pages/home", {
        title: "FLISH",
        isAuthed: false,
        topics: [],
        stats: null,
      });
    }

    const topics = await getTopicStats(req.dbUser.id);
    const totalWords = topics.reduce((sum, topic) => sum + topic.totalCount, 0);
    const totalLearned = topics.reduce(
      (sum, topic) => sum + topic.learnedCount,
      0
    );

    return res.render("pages/home", {
      title: "FLISH",
      isAuthed: true,
      topics: topics.slice(0, 6),
      stats: {
        totalWords,
        totalLearned,
        progressPercent: totalWords
          ? Math.round((totalLearned / totalWords) * 100)
          : 0,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  showHome,
};
