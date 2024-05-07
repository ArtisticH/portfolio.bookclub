const express = require('express');
const Book = require('../models/book');
const Member = require('../models/member');
const Review = require('../models/review');
const { date, rate } = require('../routes/tools');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findOne({ where: { id }});
    const totalBook = await Book.findAll({}); // 총 몇 권인지
    const member = await Member.findOne({ 
      where: { id: book.MemberId },
      attributes: ['id', 'nick'],
    });
    const stars = await Review.findAll({
      include: [{
        model: Book,
        where: { id },
      }],
      attributes: ['stars'],
    });
    // 이 책에 대한 총 리뷰 갯수
    const totalReview = stars.length;
    // 평균 구하기
    let starSum = [...stars].reduce((acc, cur, index, arr) => {
      return index === arr.length - 1 ? (acc + cur.stars) / arr.length : (acc + cur.stars);
    }, 0);
    // 소수점 한 자릿수까지
    starSum = Math.floor(starSum * 10) / 10;
    // 소수점 0, 0,5단위로 내린 별을 배열로
    const starShapes = rate(starSum);
    const results = await Review.findAll({
      include: [{
        model: Book,
        where: { id },
      }, {
        model: Member,
        attributes: ['id', 'type', 'nick'],
      }],
      order: [['id', 'DESC']], 
      limit: 5,
    });
    const reviews = [];
    results.forEach(review => {
      const text = {};
      if(review.text.length > 200) {
        text.slice = review.text.slice(0, 200);
        text.original = review.text;
      } else {
        text.slice = null;
        text.original = review.text;
      }
      reviews[reviews.length] = {
        id: review.id,
        title: review.title,
        text,
        like: review.like,
        overText: review.overText,
        stars: rate(review.stars),
        createdAt: date(review.createdAt),
        updatedAt: date(review.updatedAt),
        MemberId: review.Member.id,
        type: review.Member.type.toUpperCase(),
        nick: review.Member.nick,
      }
    });
    res.render('book', {
      book,
      totalBook: totalBook.length,
      member,
      starSum,
      starShapes,
      reviews,
      totalReview,
    });  
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;