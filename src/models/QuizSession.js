const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class QuizSession extends Model {}

  QuizSession.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id",
      },
      topicId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "topic_id",
      },
      totalCards: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "total_cards",
      },
      correctCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "correct_count",
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "started_at",
      },
      endedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ended_at",
      },
    },
    {
      sequelize,
      modelName: "QuizSession",
      tableName: "quiz_sessions",
      timestamps: false,
      underscored: true,
    }
  );

  return QuizSession;
};
