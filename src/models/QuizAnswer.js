const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class QuizAnswer extends Model {}

  QuizAnswer.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      sessionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "session_id",
      },
      flashcardId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "flashcard_id",
      },
      userAnswer: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "user_answer",
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_correct",
      },
      timeTakenMs: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "time_taken_ms",
      },
    },
    {
      sequelize,
      modelName: "QuizAnswer",
      tableName: "quiz_answers",
      timestamps: false,
      underscored: true,
    }
  );

  return QuizAnswer;
};
