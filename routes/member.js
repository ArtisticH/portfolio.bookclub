const express = require('express');
const Member = require('../models/member');
const Book = require('../models/book');
const Attend = require('../models/attend');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const member = await Member.findOne({ where: { id }});
  // 얘는 관계쿼리가 아니라, 직접 수동 입력임.
  const recommendedBook = await Book.findAll({ where: { MemberId: id }});
  // 이 멤버가 선정한 책 권수
  const recommendedBookCount = recommendedBook.length;
  // 지금까지 진행한 책 권수
  const totalBookCount = await Book.findAll({});
  // 얘도 직접 데이터베이스에 수동 입력한것
  const attendCount = await Attend.findAll({ where: { MemberId : id }});

  res.render('member', {
    member,
    recommendedBook,
    recommendedBookCount,
    totalBookCount: totalBookCount.length,
    attendCount: attendCount.length,
  });
});

module.exports = router;