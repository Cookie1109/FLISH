"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );

    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "user",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("topics", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      thumbnail_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("flashcards", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      topic_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "topics", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      word: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phonetic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      audio_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      part_of_speech: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      definition: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      example_sentence: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      example_translation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      difficulty_level: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("quiz_sessions", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      topic_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "topics", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      total_cards: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      correct_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      ended_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.createTable("quiz_answers", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      session_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "quiz_sessions", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      flashcard_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "flashcards", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      user_answer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      time_taken_ms: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });

    await queryInterface.createTable("learning_progress", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      flashcard_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "flashcards", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      view_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      correct_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      incorrect_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      mastery_level: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "new",
      },
      last_reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex("topics", ["user_id"]);
    await queryInterface.addIndex("flashcards", ["topic_id"]);
    await queryInterface.addIndex("quiz_sessions", ["user_id"]);
    await queryInterface.addIndex("quiz_sessions", ["topic_id"]);
    await queryInterface.addIndex("quiz_answers", ["session_id"]);
    await queryInterface.addIndex("quiz_answers", ["flashcard_id"]);
    await queryInterface.addIndex("learning_progress", ["user_id"]);
    await queryInterface.addIndex("learning_progress", ["flashcard_id"]);
    await queryInterface.addIndex("learning_progress", ["user_id", "flashcard_id"], {
      unique: true,
      name: "learning_progress_user_flashcard_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("learning_progress");
    await queryInterface.dropTable("quiz_answers");
    await queryInterface.dropTable("quiz_sessions");
    await queryInterface.dropTable("flashcards");
    await queryInterface.dropTable("topics");
    await queryInterface.dropTable("users");
  },
};
