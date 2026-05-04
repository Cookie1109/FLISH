const { LearningProgress } = require("../models");

function deriveMastery(progress) {
  if (progress.correctCount >= 5 && progress.incorrectCount <= 1) {
    return "mastered";
  }

  if (progress.correctCount >= 3 && progress.correctCount > progress.incorrectCount) {
    return "learning";
  }

  if (progress.incorrectCount >= progress.correctCount + 2) {
    return "struggling";
  }

  if (progress.viewCount >= 3) {
    return "review";
  }

  return "new";
}

async function updateProgress({
  userId,
  flashcardId,
  viewed = false,
  correctDelta = 0,
  incorrectDelta = 0,
}) {
  const now = new Date();
  const [progress, created] = await LearningProgress.findOrCreate({
    where: { userId, flashcardId },
    defaults: {
      viewCount: viewed ? 1 : 0,
      correctCount: correctDelta,
      incorrectCount: incorrectDelta,
      masteryLevel: "new",
      lastReviewedAt: now,
    },
  });

  if (!created) {
    if (viewed) {
      progress.viewCount += 1;
    }
    progress.correctCount += correctDelta;
    progress.incorrectCount += incorrectDelta;
    progress.lastReviewedAt = now;
  }

  progress.masteryLevel = deriveMastery(progress);
  await progress.save();
}

async function handleCardViewed({ userId, flashcardId }) {
  if (!userId || !flashcardId) return;
  await updateProgress({ userId, flashcardId, viewed: true });
}

async function handleQuizCompleted({ userId, answers }) {
  if (!userId || !Array.isArray(answers)) return;

  for (const answer of answers) {
    if (!answer?.flashcardId) continue;
    const isCorrect = Boolean(answer.isCorrect);
    await updateProgress({
      userId,
      flashcardId: answer.flashcardId,
      viewed: true,
      correctDelta: isCorrect ? 1 : 0,
      incorrectDelta: isCorrect ? 0 : 1,
    });
  }
}

module.exports = {
  handleCardViewed,
  handleQuizCompleted,
};
