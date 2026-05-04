const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const attachDbUser = require("../middleware/attachDbUser");
const { lookupDictionary } = require("../services/dictionary.service");
const { fetchImageUrl } = require("../services/image.service");
const { translateText } = require("../services/translation.service");

const router = express.Router();

router.use(authMiddleware, attachDbUser);

router.get("/me", (req, res) => {
  res.json({
    uid: req.user.uid,
    email: req.user.email || null,
    name: req.user.name || null,
  });
});

router.get("/lookup/:word", async (req, res, next) => {
  try {
    const word = req.params.word?.trim();
    if (!word) {
      return res.status(400).json({ error: "Word is required" });
    }

    let dictionaryData = null;
    let imageUrl = null;
    let exampleTranslation = null;

    try {
      dictionaryData = await lookupDictionary(word);
    } catch (error) {
      dictionaryData = null;
    }

    try {
      imageUrl = await fetchImageUrl(word);
    } catch (error) {
      imageUrl = null;
    }

    if (dictionaryData?.exampleSentence) {
      try {
        exampleTranslation = await translateText(dictionaryData.exampleSentence);
      } catch (error) {
        exampleTranslation = null;
      }
    }

    return res.json({
      word,
      ...dictionaryData,
      imageUrl,
      exampleTranslation,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
