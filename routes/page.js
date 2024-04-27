const express = require('express');
const Book = require('../models/book');
const Member = require('../models/member');
const Review = require('../models/review');

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

router.route('/review')
  .post(async (req, res) => {
    const review = await Review.create({
      title: req.body.title,
      text: req.body.text,
      overText: req.body.overText,
      stars: req.body.stars,
      BookId: req.body.bookId,
      MemberId: req.user.id,
    });
    res.status(201).json(review);
})

module.exports = router;