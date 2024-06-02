const express = require('express');
const { Book, Member, Attend } = require('../../models/main');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/', async (req, res) => {
  try {
    let results = await Member.findAll({
      attributes: ['nick', 'id'],
      where: { type: 'MEMBER' },
    });
    const members = [];
    results.forEach(item => {
      members[members.length] = {
        id: item.id,
        nick: item.nick,
      }
    });
    const books = [];
    results = await Book.findAll({ 
      attributes: ['title', 'id'],
    });
    results.forEach(item => {
      books[books.length] = {
        id: item.id,
        title: item.title,
      };
    });
    const bookTotal = books.length;
    res.render('members/members', { members, books, bookTotal });  
  } catch(err) {
    console.error(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let results = await Book.findAll({ 
      where: { MemberId: id },
      attributes: ['id'],
    });
    const ids = [];
    results.forEach(item => {
      ids[ids.length] = item.id;
    });
    results = await Attend.findAll({ where: { MemberId : id }});
    const attend = results.length;
    res.json({ ids, attend });  
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;