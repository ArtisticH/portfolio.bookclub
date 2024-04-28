const express = require('express');
const Book = require('../models/book');
const Member = require('../models/member');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/books', async (req, res) => {
  const books = await Book.findAll({});
  res.render('books', { books });
});

router.get('/members', async (req, res) => {
  const members = await Member.findAll({
    where: { type: 'member' },
  });
  // 멤버인 애들만
  const total = members.length;
  res.render('members', { total });
});

router.get('/meetings', (req, res) => {
  res.render('meetings');
});

router.get('/fun', (req, res) => {
  res.render('fun');
});

module.exports = router;