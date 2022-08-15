const express = require('express');
const User = require('../models/User');
const router = express.Router();
const authenticated = require('../middleware/auth.middleware');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({username});
  if (existingUser) {
    return res.status(400).json({
      message: 'User already exists'
    })
  }

  try {
    const savedUser = await new User({
      username,
      password
    }).save();
    const user = savedUser.toJSON();
    req.session.user = user
    delete user.password;
    res.status(200).json({
      user
    });
  } catch (err) {
    res.status(400).json({
      message: err.message
    })
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({username});
  if (!existingUser) {
    return res.status(404).json({
      message: 'User does not exists'
    })
  } else if(!existingUser.comparePassword(password)) {
    return res.status(400).json({
      message: 'Password is incorrect'
    })
  }
  const user = existingUser.toJSON();
  delete user.password;
  req.session.user = user
  res.status(200).json({
    user
  });
});

router.get('/me', authenticated, async (req, res) => {
  const {username} = req.session.user;
  const user = await User.findOne({username}, {password: 0});
  res.status(200).json({
    user
  })
});

router.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).json({
        message: err.message
      })
    }
    res.redirect('/login');
  })
});


module.exports = router;
