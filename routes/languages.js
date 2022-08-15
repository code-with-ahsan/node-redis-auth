const express = require("express");
const Language = require("../models/Language");
const router = express.Router();

router.get("/", async (_, res) => {
  const languages = await Language.find({});
  res.status(200).json({
    languages,
  });
});

module.exports = router;
