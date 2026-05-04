const { Topic, Flashcard } = require("../models");

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
    const topics = await Topic.findAll({
      where: { userId: req.dbUser.id },
      order: [["createdAt", "DESC"]],
    });

    res.render("pages/topics", {
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
      include: [{ model: Flashcard, as: "flashcards" }],
      order: [[{ model: Flashcard, as: "flashcards" }, "createdAt", "DESC"]],
    });

    if (!topic) {
      const err = new Error("Topic not found");
      err.status = 404;
      throw err;
    }

    res.render("pages/topic-detail", {
      title: topic.name,
      topic,
      flashcards: topic.flashcards || [],
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
