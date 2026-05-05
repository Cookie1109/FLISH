const { Flashcard, Topic, sequelize } = require("../models");
const { lookupDictionary } = require("../services/dictionary.service");
const { fetchImageUrl } = require("../services/image.service");
const { translateText } = require("../services/translation.service");

const DEFAULT_IMAGE =
  process.env.DEFAULT_CARD_IMAGE_URL || "/images/default-placeholder.jpg";

function nullIfEmpty(value) {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : null;
}

function parseDifficulty(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

async function getTopicForUser(userId, topicId) {
  return Topic.findOne({
    where: { id: topicId, userId },
  });
}

async function getCardForUser(cardId, userId) {
  return Flashcard.findOne({
    where: { id: cardId },
    include: [{ model: Topic, as: "topic", where: { userId } }],
  });
}

async function safeLookup(word) {
  try {
    return await lookupDictionary(word);
  } catch (error) {
    return null;
  }
}

async function safeImage(word) {
  try {
    return await fetchImageUrl(word);
  } catch (error) {
    return null;
  }
}

async function safeTranslate(sentence) {
  try {
    return await translateText(sentence);
  } catch (error) {
    return null;
  }
}

async function newCardForm(req, res, next) {
  try {
    const topic = await getTopicForUser(req.dbUser.id, req.params.id);
    if (!topic) {
      const err = new Error("Topic not found");
      err.status = 404;
      throw err;
    }

    res.render("pages/card-form", {
      title: `New card · ${topic.name}`,
      topic,
      card: {},
      action: `/topics/${topic.id}/cards`,
      submitLabel: "Create card",
    });
  } catch (error) {
    next(error);
  }
}

async function createCard(req, res, next) {
  try {
    const topic = await getTopicForUser(req.dbUser.id, req.params.id);
    if (!topic) {
      const err = new Error("Topic not found");
      err.status = 404;
      throw err;
    }

    const word = req.body.word?.trim();
    if (!word) {
      return res.status(400).render("pages/card-form", {
        title: `New card · ${topic.name}`,
        topic,
        card: req.body,
        action: `/topics/${topic.id}/cards`,
        submitLabel: "Create card",
        error: "Word is required.",
      });
    }

    const dictionaryData = await safeLookup(word);
    const imageUrl = await safeImage(word);

    // Định nghĩa = bản dịch tiếng Việt của từ (ưu tiên) hoặc định nghĩa tiếng Anh từ dictionary
    const viTranslation = await safeTranslate(word);

    const exampleSentence =
      nullIfEmpty(req.body.exampleSentence) ||
      dictionaryData?.exampleSentence ||
      null;

    const exampleTranslation =
      nullIfEmpty(req.body.exampleTranslation) ||
      (exampleSentence ? await safeTranslate(exampleSentence) : null);

    const payload = {
      topicId: topic.id,
      word,
      phonetic: nullIfEmpty(req.body.phonetic) || dictionaryData?.phonetic || null,
      audioUrl: nullIfEmpty(req.body.audioUrl) || dictionaryData?.audioUrl || null,
      imageUrl: nullIfEmpty(req.body.imageUrl) || imageUrl || DEFAULT_IMAGE,
      partOfSpeech:
        nullIfEmpty(req.body.partOfSpeech) ||
        dictionaryData?.partOfSpeech ||
        null,
      definition:
        nullIfEmpty(req.body.definition) ||
        viTranslation ||
        dictionaryData?.definition ||
        null,
      exampleSentence,
      exampleTranslation,
      difficultyLevel: parseDifficulty(req.body.difficultyLevel),
    };

    await sequelize.transaction(async (transaction) => {
      await Flashcard.create(payload, { transaction });
    });

    return res.redirect(`/topics/${topic.id}`);
  } catch (error) {
    return next(error);
  }
}

async function editCardForm(req, res, next) {
  try {
    const card = await getCardForUser(req.params.id, req.dbUser.id);
    if (!card) {
      const err = new Error("Flashcard not found");
      err.status = 404;
      throw err;
    }

    res.render("pages/card-form", {
      title: `Edit card · ${card.word}`,
      topic: card.topic,
      card,
      action: `/cards/${card.id}`,
      submitLabel: "Save changes",
    });
  } catch (error) {
    next(error);
  }
}

async function updateCard(req, res, next) {
  try {
    const card = await getCardForUser(req.params.id, req.dbUser.id);
    if (!card) {
      const err = new Error("Flashcard not found");
      err.status = 404;
      throw err;
    }

    const word = req.body.word?.trim();
    if (!word) {
      return res.status(400).render("pages/card-form", {
        title: `Edit card · ${card.word}`,
        topic: card.topic,
        card: { ...card.get(), ...req.body },
        action: `/cards/${card.id}`,
        submitLabel: "Save changes",
        error: "Word is required.",
      });
    }

    await card.update({
      word,
      phonetic: nullIfEmpty(req.body.phonetic),
      audioUrl: nullIfEmpty(req.body.audioUrl),
      imageUrl: nullIfEmpty(req.body.imageUrl) || DEFAULT_IMAGE,
      partOfSpeech: nullIfEmpty(req.body.partOfSpeech),
      definition: nullIfEmpty(req.body.definition),
      exampleSentence: nullIfEmpty(req.body.exampleSentence),
      exampleTranslation: nullIfEmpty(req.body.exampleTranslation),
      difficultyLevel: parseDifficulty(req.body.difficultyLevel),
    });

    return res.redirect(`/topics/${card.topic.id}`);
  } catch (error) {
    return next(error);
  }
}

async function deleteCard(req, res, next) {
  try {
    const card = await getCardForUser(req.params.id, req.dbUser.id);
    if (!card) {
      const err = new Error("Flashcard not found");
      err.status = 404;
      throw err;
    }

    const topicId = card.topic.id;
    await card.destroy();
    return res.redirect(`/topics/${topicId}`);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  newCardForm,
  createCard,
  editCardForm,
  updateCard,
  deleteCard,
};
