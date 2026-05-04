const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class LearningProgress extends Model {}

  LearningProgress.init(
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
      flashcardId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "flashcard_id",
      },
      viewCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "view_count",
      },
      correctCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "correct_count",
      },
      incorrectCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "incorrect_count",
      },
      masteryLevel: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "new",
        field: "mastery_level",
      },
      lastReviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "last_reviewed_at",
      },
    },
    {
      sequelize,
      modelName: "LearningProgress",
      tableName: "learning_progress",
      timestamps: false,
      underscored: true,
    }
  );

  return LearningProgress;
};
