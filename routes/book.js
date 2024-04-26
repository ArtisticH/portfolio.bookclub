const express = require('express');
const Book = require('../models/book');
const Member = require('../models/member');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const book = await Book.findOne({ where: {id: req.params.id}});
  let totalBooks = await Book.findAll({});
  totalBooks = totalBooks.length;
  const memberId = book.MemberId;
  const member = await Member.findOne({ where: {id: memberId}});

  res.render('book', {
    book,
    totalBooks,
    member,
  });
});

module.exports = router;