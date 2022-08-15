const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const FavoriteLanguage = mongoose.model("FavoriteLanguage", favoriteSchema);

module.exports = FavoriteLanguage;
