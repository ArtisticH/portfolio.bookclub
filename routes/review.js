const express = require('express');
const Review = require('../models/review');
const Book = require('../models/book');
const Member = require('../models/member');
const { funChangeDate, funCalculateRate } = require('../routes/tools');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
// 클라이언트에서 전송한 리뷰 정보 DB에 저장
// MemberId는 req.user.id 이용
router.post('/', async (req, res) => {
  try {
    const createdReview = await Review.create({
      title: req.body.title,
      text: req.body.text,
      overText: req.body.overText,
      stars: req.body.stars,
      BookId: req.body.bookId,
      MemberId: req.user.id,
    });
    const result = await Review.findOne({
      include: [{
        model: Book,
        where: { id: createdReview.BookId },
      }, {
        model: Member,
        attributes: ['id', 'type', 'nick'],
      }],
      order: [['id', 'DESC']], 
      limit: 1,
    });
    const review = {
      id: result.id,
      title: result.title,
      text: result.text,
      like: result.like,
      overText: result.overText,
      // 숫자를 배열로 변환
      stars: funCalculateRate(result.stars),
      createdAt: funChangeDate(result.createdAt),
      MemberId: result.MemberId,
      type: result.Member.type.toUpperCase(),
      nick: result.Member.nick,
    };
    res.json({ review });
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;