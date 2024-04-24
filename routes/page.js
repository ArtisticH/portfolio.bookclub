const express = require('express');
const Book = require('../models/book');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.joined = null;
  next();
});

router.get('/', (req, res) => {
  /*
  * req.session
  Session {
    cookie: {
      path: '/',
      _expires: null,
      originalMaxAge: null,
      httpOnly: true,
      secure: false
    },
    passport: { user: 1 }
  },
  * req.user
  Member {
  dataValues: {
    id: 1,
    type: 'member',
    email: 'hanna8413@naver.com',
    nick: '서망고',
    password: '$2b$12$YxBGRuSAxHeXpdMVi/9xOeWbYv4NASfKaS4t/re5r5VSwXkzcWn82',
    provider: 'local',
    snsId: null
  },....
  */
  console.log('/요청:', 'req.session? :', req.session, 'req.user? ', req.user)
  res.render('index');
});

router.get('/books', async (req, res) => {
  const books = await Book.findAll({});
  res.render('books', { books });
});

router.get('/members', (req, res) => {
  res.render('members');
});

router.get('/meetings', (req, res) => {
  res.render('meetings');
});

router.get('/fun', (req, res) => {
  res.render('fun');
});

module.exports = router;