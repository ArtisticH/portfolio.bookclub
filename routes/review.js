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
// 그냥 새로 글을 쓰는 것과 리뷰를 업데이트 하는 것을 구분해야 한다. 
router.post('/', async (req, res) => {
  try {
    const id = req.body.id;
    // id값이 있다면 업데이트, 아니라면 새로 생성
    if(!id) {
      // id가 null이라면, 즉 새로 생성이라면
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
      let text;
      if(result.text.length > 200) {
        text = {
          slice: result.text.slice(0, 200),
          original: result.text,
        };
      } else {
        text = {
          slice: null,
          original: result.text,
        };
      }
      const review = {
        id: result.id,
        title: result.title,
        text,
        like: result.like,
        overText: result.overText,
        // 숫자를 배열로 변환
        stars: funCalculateRate(result.stars),
        createdAt: funChangeDate(result.createdAt),
        updatedAt: funChangeDate(result.updatedAt),
        MemberId: result.MemberId,
        type: result.Member.type.toUpperCase(),
        nick: result.Member.nick,
      };
      res.json({ review });  
    } else {
      // 업데이트 하고
      console.log('별점', req.body.stars)
      await Review.update({
        title: req.body.title,
        text: req.body.text,
        overText: req.body.overText,
        stars: req.body.stars,
      }, {
        where: { id },
      });
      const result = await Review.findOne({
        where: { id },
      });
      // 더보기
      let text;
      if(result.text.length > 200) {
        text = {
          slice: result.text.slice(0, 200),
          original: result.text,
        };
      } else {
        text = {
          slice: null,
          original: result.text,
        };
      }
      const review = {
        title: result.title,
        text,
        overText: result.overText,
        // 숫자를 배열로 변환
        stars: funCalculateRate(result.stars),
        updatedAt: funChangeDate(result.updatedAt),
      };
      console.log('리뷰 별점', review.stars);
      res.json({ review });  
    }
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
// 클라이언트에서 수정 버튼 누르면 그 리뷰 데이터를 보내줘야 한다. 
router.get('/:reviewid', async(req, res) => {
  const id = req.params.reviewid;
  const review = await Review.findOne({
    where: { id },
  });
  res.json({ review });
});
// 리뷰 삭제
router.get('/delete/:reviewid', async(req, res) => {
});



module.exports = router;