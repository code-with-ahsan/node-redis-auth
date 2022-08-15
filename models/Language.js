const mongoose = require('mongoose');

const languagesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  iconUrl: {
    type: String,
    required: true
  }
});


const Language = mongoose.model('Language', languagesSchema);

module.exports = Language;