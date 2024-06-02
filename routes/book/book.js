const express = require('express');
const { Book, Member, Review } = require('../../models/main');
const { date, star } = require('../tools/tools');

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
    // 소수점 한 자릿수로 만들기
    sum = Math.floor(sum * 10) / 10;
    // 위의 소수점숫자를 0, 0.5단위로 내리고, 그걸 배열로 만들기
    // 만약 3.8이면 3.5로 만들고 [full, full, full, half, empty]처럼
    const { starArr, starSum } = star(sum);
    // 그리고 최신 리뷰 5개를 보내
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

    function forText(item) {
      const text = {};
      if(item.length > 200) {
        text.slice = item.slice(0, 200);
        text.original = item;
      } else {
        text.slice = null;
        text.original = item;
      }
      return text;
    }
    const reviews = results.map(review => {
      return {
        id: review.id,
        title: review.title,
        text: forText(review.text),
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