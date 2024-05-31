const express = require('express');
const { Book, Member } = require('../models/main');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/', async (req, res) => {
  const members = await Member.findAll({
    where: { type: 'MEMBER' },
    attributes: ['id', 'nick'],
  })
  res.render('index', { members });
});

router.get('/books', async (req, res) => {
  const books = await Book.findAll({
    attributes: ['id', 'title', 'author'],
  });
  res.render('book/books', { books });
});

router.get('/fun', (req, res) => {
  res.render('rest/fun');
});

module.exports = router;