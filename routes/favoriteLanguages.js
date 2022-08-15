const express = require('express');
const authenticated = require('../middleware/auth.middleware');
const FavoriteLanguage = require('../models/FavoriteLanguage');
const router = express.Router();

router.post("/", async (req, res) => {
  const { _id: userId } = req.session.user;
  const { languageId } = req.body;
  if (!languageId) {
    return res.status(400).json({
      message: 'LanguageID missing'
    })
  }

  const language = await FavoriteLanguage.findOneAndUpdate({
    user: userId,
  }, {
    language: languageId
  }, {
    upsert: true,
    new: true
  });

  res.status(200).json({
    language
  })
})

router.get("/", async (req, res) => {
  const { _id: userId } = req.session.user;
  const favoriteLang = await FavoriteLanguage.findOne({user: userId}).populate(
    ["language"]
  );
  res.status(200).json({
    language: favoriteLang?.language || null
  })
});

router.get('/report', async (req, res) => {
  const languages = await FavoriteLanguage.aggregate([{
    /**
     * _id: The id of the group.
     * fieldN: The first field name.
     */
    $group: {
      _id: "$language",
      count: {
        $sum: 1
      }
    }
  }, {
    /**
     * from: The target collection.
     * localField: The local join field.
     * foreignField: The target join field.
     * as: The name for the results.
     * pipeline: The pipeline to run on the joined collection.
     * let: Optional variables to use in the pipeline field stages.
     */
    $lookup: {
      from: 'languages',
      localField: '_id',
      foreignField: '_id',
      as: 'language'
    }
  }])
  res.status(200).json({
    languages
  })
})


module.exports = router;