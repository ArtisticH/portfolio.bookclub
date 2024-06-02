const express = require('express');
const { Book, Member, Attend } = require('../../models/main');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // 멤버인 애들만 골라
    let results = await Member.findAll({
      attributes: ['nick', 'id'],
      where: { type: 'MEMBER' },
    });
    const members = results.map(item => {
      return {
        id: item.id,
        nick: item.nick,
      }
    });
    results = await Book.findAll({ 
      attributes: ['title', 'id'],
    });
    const books = results.map(item => {
      return {
        id: item.id,
        title: item.title,
      }
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
    // 이 친구가 추천한 책 아이디들 다 모아
    let results = await Book.findAll({ 
      where: { MemberId: id },
      attributes: ['id'],
    });
    const ids = results.map(item => {
      return item.id;
    });
    // 이 친구가 참여한 미팅 횟수
    results = await Attend.findAll({ where: { MemberId : id }});
    const attend = results.length;
    res.json({ ids, attend });  
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;