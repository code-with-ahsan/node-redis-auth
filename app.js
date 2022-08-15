const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
require('dotenv').config();
require('./dbConnect')();
const { createClient } = require('redis');
const connectRedis = require('connect-redis');
const redisClient = createClient({
  url: process.env.REDIS_URL,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  legacyMode: true,
});

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const languagesRouter = require('./routes/languages');
const favoriteLanguagesRouter = require('./routes/favoriteLanguages');


const RedisStore = connectRedis(session);
redisClient.connect().catch(e => console.log('Could not connect to redis', e));

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // if true only transmit cookie over https
    httpOnly: false, // if true prevent client side JS from reading the cookie
    maxAge: 1000 * 60 * 10, // session max age in miliseconds
  },
}))

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/languages', languagesRouter);
app.use('/favorite-languages', favoriteLanguagesRouter);

app.use('/hello', (req, res) => {
  if (req.session.viewCount === undefined) {
    req.session.viewCount = 0;
  } else {
    req.session.viewCount++;
  }
  res.json({
    viewCount: 'View count is: ' + req.session.viewCount
  });
})

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
