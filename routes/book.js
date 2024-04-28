const express = require('express');
const Book = require('../models/book');
const Member = require('../models/member');
const Review = require('../models/review');
const { dateChange, memberType, calculateRate } = require('../routes/tools');


const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/:id', async (req, res) => {
  try {

    const book = await Book.findOne({ where: {id: req.params.id}});
    let totalBooks = await Book.findAll({});
    totalBooks = totalBooks.length;
    const memberId = book.MemberId;
    const member = await Member.findOne({ where: {id: memberId}});
    const stars = await Review.findAll({
      include: [{
        model: Book,
        where: { id: req.params.id}
      }],
      attributes: ['stars'],
    });

    let starSum = [...stars].reduce((acc, cur, index, arr) => {
      return index === arr.length - 1 ? (acc + cur.stars) / arr.length : (acc + cur.stars);
    }, 0);
    starSum = Math.floor(starSum * 10) / 10;

    const starshapes = calculateRate(starSum);

    const reviewResults = await Review.findAll({
      include: [{
        model: Book,
        where: { id: req.params.id}
      }, {
        model: Member,
      }], 
    });

    reviewResults.reverse();
    const reviewBoxesLength = reviewResults.length;

    const reviewBoxes = [];
    let pageNumbers = [];

    if(reviewResults.length >= 5) {
      // 리뷰가 5개 이상이면 뒤에서부터 5개만 보내, 한 페이지에 보여지는 리뷰는 5개
      for(let i = 0; i < 5; i++) {
        reviewBoxes[reviewBoxes.length] = {
          title: reviewResults[i].title,
          text: reviewResults[i].text,
          like: reviewResults[i].like,
          overText: reviewResults[i].overText,
          stars: calculateRate(reviewResults[i].stars),
          createdAt: dateChange(reviewResults[i].createdAt),
          MemberId: reviewResults[i].Member.id,
          nick: reviewResults[i].Member.nick,
          type: memberType(reviewResults[i].Member.type),
        }
      }  
    } else if(reviewResults.length < 5) {
      // 리뷰가 5개 이하면 그 갯수만큼 보내, 그리고 페이지는 1만 있을것임. 
      for(let i = 0; i < reviewResults.length; i++) {
        reviewBoxes[reviewBoxes.length] = {
          title: reviewResults[i].title,
          text: reviewResults[i].text,
          like: reviewResults[i].like,
          overText: reviewResults[i].overText,
          stars: calculateRate(reviewResults[i].stars),
          createdAt: dateChange(reviewResults[i].createdAt),
          MemberId: reviewResults[i].Member.id,
          nick: reviewResults[i].Member.nick,
          type: memberType(reviewResults[i].Member.type),
        }
      }  
    }

    if(reviewResults.length >= 25) {
      // 만약 리뷰 갯수가 25개 이상이라면 페이지가 1, 2, 3, 4, 5 다 있을 것이고, 
      pageNumbers = [1, 2, 3, 4, 5];
    } else {
      // 리뷰 갯수가 25개 미만이라면
      const share = Math.floor(reviewResults.length / 5);
      if(reviewResults.length % 5 === 0) {
        // 만약 5의 배수라면 예를 들어 20개라면 1, 2, 3, 4만 있을 것
        for(let i = 1; i <= share; i++) {
          pageNumbers[pageNumbers.length] = i;
        }
      } else {
        // 5의 배수가 아니라면, 예를 들어 17개라면 (몫 + 1)의 페이지 갯수인 1, 2, 3, 4가 될 것임.
        for(let i = 1; i <= (share + 1); i++) {
          pageNumbers[pageNumbers.length] = i;
        }
      }
    }

    res.render('book', {
      book,
      totalBooks,
      member,
      starSum,
      starshapes,
      reviewBoxes,
      reviewBoxesLength,
      pageNumbers,
    });  
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;