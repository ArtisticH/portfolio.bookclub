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
  const members = await Member.findAll({});
  res.render('members', { memberslength: members.length });
});

router.get('/meetings', (req, res) => {
  res.render('meetings');
});

router.get('/fun', (req, res) => {
  res.render('fun');
});

router.post('/review', (req, res) => {
  console.log(req.body.title, req.body.text, req.body.bookId);
});

module.exports = router;