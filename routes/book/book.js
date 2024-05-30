const express = require('express');
const { Book, Member, Review } = require('../../models/main');
const { date, star } = require('../rest/middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findOne({ where: { id }});
    const totalBook = await Book.findAll({}); 
    const nick = await Member.findOne({ 
      where: { id: book.MemberId },
      attributes: ['nick'],
    });
    // 해당 책 평점 다 긁어오기
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
    let sum = [...stars].reduce((acc, cur, index, arr) => {
      return index === arr.length - 1 ? (acc + cur.stars) / arr.length : (acc + cur.stars);
    }, 0);
    // 소수점 한 자릿수 만들기
    sum = Math.floor(sum * 10) / 10;
    // 위의 소수점숫자를 0, 0.5단위로 내리고, 그걸 배열로 만들기
    const { starArr, starSum } = star(sum);
    // 그리고 최신 5개를 보내
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
      // 리뷰 글이 200자를 넘으면 slice에 잘라 보내고
      // 200자 미만이면 original만 보내기
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
        stars: star(review.stars).starArr,
        createdAt: date(review.createdAt),
        updatedAt: date(review.updatedAt),
        MemberId: review.Member.id,
        type: review.Member.type,
        nick: review.Member.nick,
      }
    });
    res.render('book/book', {
      book,
      totalBook: totalBook.length,
      nick: nick.nick,
      // 평점과 평점 배열
      starSum,
      starArr,
      reviews,
      totalReview,
    });  
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;