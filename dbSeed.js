require('dotenv').config();
const dbConnect = require('./dbConnect');
const fs = require('fs');
const path = require('path');
const Language = require('./models/Language');

(async () => {
  const connection = await dbConnect();
  const languages = await Language.find({});
  if (languages.length !== 0) {
    console.log("🚀 Languages already added. Stopping the script here.")
    connection.disconnect();
    return;
  }
  const languagesFromGithubJson = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, './data/languages-from-github.json'), 'utf-8'
    )
  );
  const languagesToAdd = Object.keys(languagesFromGithubJson).map(key => {
    const name = key;
    const iconKey = languagesFromGithubJson[key];
    const iconUrl = `https://github.com/abrahamcalf/programming-languages-logos/raw/master/src/${iconKey}/${iconKey}.svg`;
    return {
      name,
      iconUrl
    }
  })

  try {
    await Language.insertMany(languagesToAdd);
    console.log("🚀 Languages added to the database. Woohoo!")
  } catch (e) {
    console.log(e);
  }

  connection.disconnect();
})();