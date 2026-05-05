const { Op } = require("sequelize");
const { Topic, Flashcard, LearningProgress } = require("../models");
const { getTopicStats } = require("../services/topic-stats.service");
const { getTopicAccent, getTopicInitial } = require("../services/theme.service");

const PAGE_SIZE = 20;

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function normalizeTopicPayload(body) {
  const name = body.name?.trim() || "";
  const description = body.description?.trim() || null;
  const thumbnailUrl = body.thumbnailUrl?.trim() || null;
  const isPublic = body.isPublic === "on" || body.isPublic === "true";

  return { name, description, thumbnailUrl, isPublic };
}

async function getTopicForUser(userId, topicId) {
  return Topic.findOne({
    where: { id: topicId, userId },
  });
}

async function listTopics(req, res, next) {
  try {
    const topics = await getTopicStats(req.dbUser.id);

    return res.render("pages/topics", {
      title: "Topics",
      topics,
    });
  } catch (error) {
    next(error);
  }
}

function newTopicForm(req, res) {
  res.render("pages/topic-form", {
    title: "New Topic",
    topic: {},
    action: "/topics",
    submitLabel: "Create topic",
  });
}

async function createTopic(req, res, next) {
  try {
    const { name, description, thumbnailUrl, isPublic } =
      normalizeTopicPayload(req.body);

    if (!name) {
      return res.status(400).render("pages/topic-form", {
        title: "New Topic",
        topic: { name, description, thumbnailUrl, isPublic },
        action: "/topics",
        submitLabel: "Create topic",
        error: "Topic name is required.",
      });
    }

    const topic = await Topic.create({
      userId: req.dbUser.id,
      name,
      description,
      thumbnailUrl,
      isPublic,
    });

    return res.redirect(`/topics/${topic.id}`);
  } catch (error) {
    return next(error);
  }
}

async function showTopic(req, res, next) {
  try {
    const topic = await Topic.findOne({
      where: { id: req.params.id, userId: req.dbUser.id },
    });

    if (!topic) {
      const err = new Error("Topic not found");
      err.status = 404;
      throw err;
    }

    const totalCount = await Flashcard.count({
      where: { topicId: topic.id },
    });

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const currentPage = Math.min(
      toPositiveInt(req.query.page, 1),
      totalPages
    );
    const offset = (currentPage - 1) * PAGE_SIZE;

    const flashcards = await Flashcard.findAll({
      where: { topicId: topic.id },
      order: [["createdAt", "DESC"]],
    });

    const flashcardIds = flashcards.map((card) => card.id);
    const progressRows = flashcardIds.length
      ? await LearningProgress.findAll({
          where: {
            userId: req.dbUser.id,
            flashcardId: flashcardIds,
          },
        })
      : [];

    const progressMap = new Map(
      progressRows.map((row) => [row.flashcardId, row])
    );

    const flashcardData = flashcards.map((card) => {
      const level = progressMap.get(card.id)?.masteryLevel || "new";
      return {
        ...card.get(),
        masteryLevel: level,
        isMastered: level === "mastered",
      };
    });

    const learnedCount = await LearningProgress.count({
      where: {
        userId: req.dbUser.id,
        masteryLevel: { [Op.in]: ["learning", "mastered"] },
      },
      include: [
        {
          model: Flashcard,
          as: "flashcard",
          attributes: [],
          where: { topicId: topic.id },
        },
      ],
      distinct: true,
    });

    const learnedPercent = totalCount
      ? Math.round((learnedCount / totalCount) * 100)
      : 0;

    res.render("pages/topic-detail", {
      title: topic.name,
      topic: {
        ...topic.get(),
        accentColor: getTopicAccent(topic).color,
        accentText: getTopicAccent(topic).text,
        initial: getTopicInitial(topic),
      },
      flashcards: flashcardData,
      totalCount,
      learnedCount,
      learnedPercent,
      pagination: {
        currentPage,
        totalPages,
        totalCount,
        perPage: PAGE_SIZE,
        hasPrev: currentPage > 1,
        hasNext: currentPage < totalPages,
        prevPage: currentPage - 1,
        nextPage: currentPage + 1,
        show: totalPages > 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function editTopicForm(req, res, next) {
  try {
    const topic = await getTopicForUser(req.dbUser.id, req.params.id);
    if (!topic) {
      const err = new Error("Topic not found");
      err.status = 404;
      throw err;
    }

    res.render("pages/topic-form", {
      title: "Edit Topic",
      topic,
      action: `/topics/${topic.id}`,
      submitLabel: "Save changes",
    });
  } catch (error) {
    next(error);
  }
}

async function updateTopic(req, res, next) {
  try {
    const topic = await getTopicForUser(req.dbUser.id, req.params.id);
    if (!topic) {
      const err = new Error("Topic not found");
      err.status = 404;
      throw err;
    }

    const { name, description, thumbnailUrl, isPublic } =
      normalizeTopicPayload(req.body);

    if (!name) {
      return res.status(400).render("pages/topic-form", {
        title: "Edit Topic",
        topic: { ...topic.get(), name, description, thumbnailUrl, isPublic },
        action: `/topics/${topic.id}`,
        submitLabel: "Save changes",
        error: "Topic name is required.",
      });
    }

    await topic.update({ name, description, thumbnailUrl, isPublic });

    return res.redirect(`/topics/${topic.id}`);
  } catch (error) {
    return next(error);
  }
}

async function deleteTopic(req, res, next) {
  try {
    const topic = await getTopicForUser(req.dbUser.id, req.params.id);
    if (!topic) {
      const err = new Error("Topic not found");
      err.status = 404;
      throw err;
    }

    await topic.destroy();
    return res.redirect("/topics");
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTopics,
  newTopicForm,
  createTopic,
  showTopic,
  editTopicForm,
  updateTopic,
  deleteTopic,
};
