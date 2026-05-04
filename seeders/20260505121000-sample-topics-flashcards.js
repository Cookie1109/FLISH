"use strict";

const { randomUUID } = require("crypto");
const { QueryTypes } = require("sequelize");

const DEMO_EMAIL = "demo@flish.local";
const DAILY_TOPIC = "Daily Life";
const TRAVEL_TOPIC = "Travel Essentials";

async function findUserId(queryInterface) {
  const rows = await queryInterface.sequelize.query(
    "SELECT id FROM users WHERE email = :email LIMIT 1",
    {
      replacements: { email: DEMO_EMAIL },
      type: QueryTypes.SELECT,
    }
  );

  return rows[0]?.id || null;
}

async function getOrCreateUser(queryInterface, now) {
  const existingId = await findUserId(queryInterface);
  if (existingId) return existingId;

  const userId = randomUUID();
  await queryInterface.bulkInsert("users", [
    {
      id: userId,
      username: "demo",
      email: DEMO_EMAIL,
      password_hash: null,
      role: "user",
      created_at: now,
    },
  ]);

  return userId;
}

async function getOrCreateTopic(queryInterface, now, userId, name, description) {
  const rows = await queryInterface.sequelize.query(
    "SELECT id FROM topics WHERE user_id = :userId AND name = :name LIMIT 1",
    {
      replacements: { userId, name },
      type: QueryTypes.SELECT,
    }
  );

  if (rows[0]?.id) return rows[0].id;

  const topicId = randomUUID();
  await queryInterface.bulkInsert("topics", [
    {
      id: topicId,
      user_id: userId,
      name,
      description,
      thumbnail_url: null,
      is_public: true,
      created_at: now,
    },
  ]);

  return topicId;
}

async function getExistingWords(queryInterface, topicId) {
  const rows = await queryInterface.sequelize.query(
    "SELECT word FROM flashcards WHERE topic_id = :topicId",
    {
      replacements: { topicId },
      type: QueryTypes.SELECT,
    }
  );

  return new Set(rows.map((row) => row.word.toLowerCase()));
}

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const userId = await getOrCreateUser(queryInterface, now);

    const topicDailyId = await getOrCreateTopic(
      queryInterface,
      now,
      userId,
      DAILY_TOPIC,
      "Everyday words and phrases."
    );
    const topicTravelId = await getOrCreateTopic(
      queryInterface,
      now,
      userId,
      TRAVEL_TOPIC,
      "Common travel vocabulary."
    );

    const existingDaily = await getExistingWords(queryInterface, topicDailyId);
    const existingTravel = await getExistingWords(queryInterface, topicTravelId);

    const flashcards = [];
    const maybeAdd = (topicId, existing, payload) => {
      if (!existing.has(payload.word.toLowerCase())) {
        flashcards.push({
          id: randomUUID(),
          topic_id: topicId,
          phonetic: null,
          audio_url: null,
          image_url: "/images/default-placeholder.jpg",
          example_translation: "Translation placeholder.",
          created_at: now,
          ...payload,
        });
      }
    };

    maybeAdd(topicDailyId, existingDaily, {
      word: "breakfast",
      part_of_speech: "noun",
      definition: "The first meal of the day.",
      example_sentence: "I eat breakfast at 7 AM.",
      difficulty_level: 1,
    });
    maybeAdd(topicDailyId, existingDaily, {
      word: "commute",
      part_of_speech: "verb",
      definition: "To travel regularly between home and work.",
      example_sentence: "She commutes by train every day.",
      difficulty_level: 2,
    });
    maybeAdd(topicDailyId, existingDaily, {
      word: "laundry",
      part_of_speech: "noun",
      definition: "Clothes and linens that need washing.",
      example_sentence: "I do laundry on Saturday.",
      difficulty_level: 1,
    });
    maybeAdd(topicDailyId, existingDaily, {
      word: "schedule",
      part_of_speech: "noun",
      definition: "A plan that lists times for events or tasks.",
      example_sentence: "My schedule is busy this week.",
      difficulty_level: 2,
    });
    maybeAdd(topicDailyId, existingDaily, {
      word: "relax",
      part_of_speech: "verb",
      definition: "To rest and become less tense.",
      example_sentence: "I relax after work.",
      difficulty_level: 1,
    });

    maybeAdd(topicTravelId, existingTravel, {
      word: "ticket",
      part_of_speech: "noun",
      definition: "A printed or digital pass for travel or entry.",
      example_sentence: "He booked a ticket to Hanoi.",
      difficulty_level: 1,
    });
    maybeAdd(topicTravelId, existingTravel, {
      word: "passport",
      part_of_speech: "noun",
      definition: "An official document for international travel.",
      example_sentence: "Keep your passport safe.",
      difficulty_level: 1,
    });
    maybeAdd(topicTravelId, existingTravel, {
      word: "luggage",
      part_of_speech: "noun",
      definition: "Bags and suitcases for travel.",
      example_sentence: "Her luggage is heavy.",
      difficulty_level: 1,
    });
    maybeAdd(topicTravelId, existingTravel, {
      word: "itinerary",
      part_of_speech: "noun",
      definition: "A plan for a journey.",
      example_sentence: "The itinerary includes three cities.",
      difficulty_level: 2,
    });
    maybeAdd(topicTravelId, existingTravel, {
      word: "reservation",
      part_of_speech: "noun",
      definition: "An arrangement to book a seat or room.",
      example_sentence: "We made a hotel reservation.",
      difficulty_level: 2,
    });

    if (flashcards.length) {
      await queryInterface.bulkInsert("flashcards", flashcards);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("flashcards", null, {});
    await queryInterface.bulkDelete("topics", null, {});
    await queryInterface.bulkDelete("users", { email: DEMO_EMAIL }, {});
  },
};
