const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Flashcard extends Model {}

  Flashcard.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      topicId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "topic_id",
      },
      word: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phonetic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      audioUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "audio_url",
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "image_url",
      },
      partOfSpeech: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "part_of_speech",
      },
      definition: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      exampleSentence: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "example_sentence",
      },
      exampleTranslation: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "example_translation",
      },
      difficultyLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "difficulty_level",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
    },
    {
      sequelize,
      modelName: "Flashcard",
      tableName: "flashcards",
      timestamps: false,
      underscored: true,
    }
  );

  return Flashcard;
};
