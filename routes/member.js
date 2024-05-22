const express = require('express');
const { Book, Member, Attend } = require('../models/main');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const member = await Member.findOne({ 
    where: { id },
    attributes: ['id', 'nick'],
  });
  const books = await Book.findAll({ where: { MemberId: id }});
  const bookTotal = await Book.findAll({});
  const attend = await Attend.findAll({ where: { MemberId : id }});
  res.render('member', {
    member,
    books,
    bookTotal: bookTotal.length,
    attend: attend.length,
  });
});

module.exports = router;