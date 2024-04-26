const express = require('express');
const Member = require('../models/member');
const Book = require('../models/book');
const Attend = require('../models/attend');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const member = await Member.findOne({ where: { id }});
  const books = await Book.findAll({ where: { MemberId: id }});
  const orderBooks = books.length;
  let totalBooks = await Book.findAll({});
  totalBooks = totalBooks.length;
  let attendCount = await Attend.findAll({ where: { MemberId : id }});
  attendCount = attendCount.length;
  console.log(orderBooks, totalBooks, attendCount);

  res.render('member', {
    member,
    books,
    orderBooks,
    totalBooks,
    attendCount,
  });
});

module.exports = router;