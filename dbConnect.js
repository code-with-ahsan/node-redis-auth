const mongoose = require('mongoose');

module.exports = () => {
  const databaseUrl = `${process.env.MONGODB_URL}/${process.env.MONGODB_DATABASE}`
  return mongoose.connect(databaseUrl).catch(e => {
    console.log("Could not connect to MongoDB", e);
  })
}