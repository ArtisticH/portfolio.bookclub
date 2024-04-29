const express = require('express');
const Review = require('../models/review');
const Book = require('../models/book');
const Member = require('../models/member');
const db = require('../models');
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

router.post('/like/:reviewid', async (req, res) => {
  const id = req.params.reviewid;
  // 먼저 해당 리뷰 글에 작성자가 하트를 클릭한 적 있는지 검사
  const result = await db.sequelize.models.ReviewLike.findOne({
    where: {
      ReviewId: id,
      MemberId: req.user.id,  
    }
  });
  // 결과가 있다면 추가 안됌
  const clickAllowed = result ? false : true;
  // 있다면 추가하지 않고
  // 없다면 ReviewLike에 추가하고, Review - like에 +1;
  if(clickAllowed) {
    // ReviewLike에 관계 추가
    await db.sequelize.models.ReviewLike.create({
      ReviewId: id,
      MemberId: req.user.id,
    });
    // like값 1 증가
    await Review.increment('like', {
      by: 1,
      where: { id }
    });
    // 업데이트된 like값 보내기
    const result = await Review.findOne({
      where: { id },
      attributes: ['like'],
    });
    // 그리고 그 답을 클라이언트에 보내
    res.json({ clickAllowed, like: result.like });
  } else {
    res.json({ clickAllowed });
  }
});

router.post('/like/cancel/:reviewid', async (req, res) => {
  const id = req.params.reviewid;
  // 좋아요 취소
  await Review.decrement('like', {
    by: 1,
    where: { id }
  });
  await db.sequelize.models.ReviewLike.destroy({
    where: {
      ReviewId: id,
      MemberId: req.user.id,  
    },
  });
  const result = await Review.findOne({
    where: { id },
    attributes: ['like'],
  });
  res.json({ like: result.like });
});

module.exports = router;