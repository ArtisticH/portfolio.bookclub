const express = require('express');
const Member = require('../models/member');
const Book = require('../models/book');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const member = await Member.findOne({
    attributes: ['id', 'nick'],
    where: { id },
  });
  console.log(member, 'member');
  const book = await Book.findAll({
    include: [{
      model: Member,
    }]
  });
  console.log(book, 'book')
  res.render('member', { member });
});

module.exports = router;