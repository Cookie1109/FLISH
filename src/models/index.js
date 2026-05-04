const sequelize = require("../config/database");

const User = require("./User")(sequelize);
const Topic = require("./Topic")(sequelize);
const Flashcard = require("./Flashcard")(sequelize);
const QuizSession = require("./QuizSession")(sequelize);
const QuizAnswer = require("./QuizAnswer")(sequelize);
const LearningProgress = require("./LearningProgress")(sequelize);

User.hasMany(Topic, {
  foreignKey: "userId",
  as: "topics",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Topic.belongsTo(User, {
  foreignKey: "userId",
  as: "owner",
});

Topic.hasMany(Flashcard, {
  foreignKey: "topicId",
  as: "flashcards",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Flashcard.belongsTo(Topic, {
  foreignKey: "topicId",
  as: "topic",
});

User.hasMany(QuizSession, {
  foreignKey: "userId",
  as: "quizSessions",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
QuizSession.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Topic.hasMany(QuizSession, {
  foreignKey: "topicId",
  as: "quizSessions",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
QuizSession.belongsTo(Topic, {
  foreignKey: "topicId",
  as: "topic",
});

QuizSession.hasMany(QuizAnswer, {
  foreignKey: "sessionId",
  as: "answers",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
QuizAnswer.belongsTo(QuizSession, {
  foreignKey: "sessionId",
  as: "session",
});

Flashcard.hasMany(QuizAnswer, {
  foreignKey: "flashcardId",
  as: "answers",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
QuizAnswer.belongsTo(Flashcard, {
  foreignKey: "flashcardId",
  as: "flashcard",
});

User.hasMany(LearningProgress, {
  foreignKey: "userId",
  as: "learningProgress",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
LearningProgress.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Flashcard.hasMany(LearningProgress, {
  foreignKey: "flashcardId",
  as: "learningProgress",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
LearningProgress.belongsTo(Flashcard, {
  foreignKey: "flashcardId",
  as: "flashcard",
});

module.exports = {
  sequelize,
  User,
  Topic,
  Flashcard,
  QuizSession,
  QuizAnswer,
  LearningProgress,
};
