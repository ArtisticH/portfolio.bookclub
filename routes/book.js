const express = require('express');
const Book = require('../models/book');
const Member = require('../models/member');
const Review = require('../models/review');
const { funChangeDate, funCalculateRate } = require('../routes/tools');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // 예를 들어 /book/1이면 id가 1인 book 정보 찾기
    // id, title, author, img, meetingDate가 쓰임 
    const book = await Book.findOne({ where: { id }});
    const totalBookCount = await Book.findAll({});
    // 이 책을 추천한 멤버의 id
    const memberId = book.MemberId;
    // 추천이: 닉네임으로 /member/1 로 넘어가게
    const member = await Member.findOne({ 
      where: { id: memberId },
      attributes: ['id', 'nick'],
    });
    // Book 모델의 id가 현재 id와 일치하는 자료,
    // 그니까 현재 책에 대한 리뷰
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
    // 소수점 0.5, 0 단위로 맞춘 별의 모양 배열,
    const starshapes = funCalculateRate(starSum);
    // 현재 책에 대한 리뷰들을 고르고
    // 그 책을 작성한 이에 대한 자료(리뷰 작성 시 req.user.id가 저장되었음),
    // 리뷰 아이디, 타이틀, 텍스트, 별, like, overText, 작성 날짜
    // 리뷰 쓴 사람의 id, type, nick, 
    // 끝에서 5개만 선정 
    const reviewResults = await Review.findAll({
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
    const reviewBoxes = [];
    reviewResults.forEach(review => {
      const text = {};
      if(review.text.length > 200) {
        text.slice = review.text.slice(0, 200);
        text.original = review.text;
      } else {
        text.slice = null;
        text.original = review.text;
      }
      reviewBoxes[reviewBoxes.length] = {
        id: review.id,
        title: review.title,
        text,
        like: review.like,
        overText: review.overText,
        // 숫자를 배열로 변환
        stars: funCalculateRate(review.stars),
        createdAt: funChangeDate(review.createdAt),
        updatedAt: funChangeDate(review.updatedAt),
        MemberId: review.Member.id,
        type: review.Member.type.toUpperCase(),
        nick: review.Member.nick,
      }
    });
    let pageNumbers = [];
    if(totalReview >= 25) {
      // 만약 리뷰 갯수가 25개 이상이라면 페이지가 1, 2, 3, 4, 5 다 있을 것이고, 
      pageNumbers = [1, 2, 3, 4, 5];
    } else {
      // 리뷰 갯수가 25개 미만일때
      const share = Math.floor(totalReview / 5);
      if(totalReview % 5 === 0) {
        // 만약 5의 배수라면, 예를 들어 20개라면 1, 2, 3, 4만 있을 것
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
      totalBookCount: totalBookCount.length,
      member,
      starSum,
      starshapes,
      reviewBoxes,
      totalReview,
      pageNumbers,
    });  
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;