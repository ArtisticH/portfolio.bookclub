const express = require('express');
const { Book, Member, Review } = require('../../models/main');
const db = require('../../models');
const { date, star } = require('../tools/tools');

function overText(bool, realText) {
  let text;
  if(bool) {
    // 글자 수가 많으면 우선 slice가 보여야 한다.
    text = {
      slice: realText.slice(0, 200),
      original: realText,
    };
  } else {
    text = {
      slice: null,
      original: realText,
    };
  }
  return text;
}

function makeStar(stars) {
  // 평균 구하고
  let sum = [...stars].reduce((acc, cur, index, arr) => {
    return index === arr.length - 1 ? (acc + cur.stars) / arr.length : (acc + cur.stars);
  }, 0);
  // 소숫점 한 자리로 만들고
  sum = Math.floor(sum * 10) / 10;
  return star(sum);
}

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
// 리뷰 새로 등록
// 📍 클라이언트에서 쿠키 시간을 넘어 전송할때
// 여기서 req.authenticated로 걸러내기
router.post('/', async (req, res) => {
  try {
    const BookId = req.body.BookId;
    const MemberId = req.body.MemberId;
    // 리뷰 등록
    const created = await Review.create({
      title: req.body.title,
      text: req.body.text,
      overText: req.body.overText,
      stars: req.body.stars,
      BookId,
      MemberId,
    });
    // 방금 등록한 컨텐츠 가져오기
    const result = await Review.findOne({
      include: [{
        model: Book,
        where: { id: BookId },
      }, {
        model: Member,
        attributes: ['id', 'type', 'nick'],
      }],
      order: [['id', 'DESC']], 
      limit: 1,
      where: { id: created.id },
    });
    // 등록 후 이 책에 관련된 모든 평점 업데이트
    const stars = await Review.findAll({
      include: [{
        model: Book,
        where: { id: BookId },
      }],
      attributes: ['stars'],
    });
    // 평점과 배열
    const { starArr, starSum } = makeStar(stars);
    const review = {
      id: result.id,
      title: result.title,
      text: overText(result.overText, result.text),
      like: result.like,
      overText: result.overText,
      stars: star(result.stars).starArr,
      createdAt: date(result.createdAt),
      updatedAt: date(result.updatedAt),
      MemberId: result.Member.id,
      type: result.Member.type,
      nick: result.Member.nick,
    };
    res.json({
      review,
      starArr,
      starSum,
    });  
  } catch(err) {
    console.error(err);
  }
});
// 좋아요 눌렀을때
router.post('/like', async (req, res) => {
  try {
    const ReviewId = req.body.ReviewId;
    const MemberId = req.body.MemberId
    // 먼저 해당 리뷰 글에 작성자가 하트를 클릭한 적 있는지 검사
    const result = await db.sequelize.models.ReviewLike.findOne({
      where: {
        ReviewId,
        MemberId,  
      }
    });
    // 클릭한적있다면(결과가있다면) clickAllowed = false이고
    // 클릭한적없다면 clickAllowed = true
    const clickAllowed = result ? false : true;
    if(clickAllowed) {
      // 클릭 반영해줄게. 
      // ReviewLike에 관계 추가
      await db.sequelize.models.ReviewLike.create({
        ReviewId,
        MemberId,
      });
      // like값 1 증가
      await Review.increment('like', {
        by: 1,
        where: { id: ReviewId }
      });
      // 업데이트된 like값 보내기
      const result = await Review.findOne({
        where: { id: ReviewId },
        attributes: ['like'],
      });
      const like = result.like;
      // 그리고 그 답을 클라이언트에 보내
      res.json({ clickAllowed, like });
    } else {
      res.json({ clickAllowed });
    }  
  } catch(err) {
    console.err(err);
  }
});
// 좋아요 취소
router.post('/like/cancel', async (req, res) => {
  try {
    const ReviewId = req.body.ReviewId;
    const MemberId = req.body.MemberId
    // 좋아요 취소
    await Review.decrement('like', {
      by: 1,
      where: { id: ReviewId },
    });
    await db.sequelize.models.ReviewLike.destroy({
      where: {
        ReviewId,
        MemberId, 
      },
    });
    const result = await Review.findOne({
      where: { id: ReviewId },
      attributes: ['like'],
    });
    res.json({ like: result.like });  
  } catch(err) {
    console.error(err);
  }
});
// 클라이언트에서 수정 버튼 누르면 해당 데이터가 담긴 리뷰 폼을 띄우기 위해
// 해당 데이터를 보내줘야 한다.
router.get('/:reviewid', async(req, res) => {
  try {
    const id = req.params.reviewid;
    const review = await Review.findOne({
      where: { id },
    });
    res.json({ review });    
  } catch(err) {
    console.error(err);
  }
});
// 업데이트
router.patch('/', async (req, res) => {
  try {
    const bookId = req.body.BookId;
    const id = req.body.id;
    await Review.update({
      title: req.body.title,
      text: req.body.text,
      overText: req.body.overText,
      stars: req.body.stars,
    }, {
      where: { id },
      include: [{
        model: Book,
        where: { id: bookId },
      }],
    });
    const stars = await Review.findAll({
      include: [{
        model: Book,
        where: { id: bookId },
      }],
      attributes: ['stars'],
    });
    const { starArr, starSum } = makeStar(stars);
    // 업데이트된 친구
    const result = await Review.findOne({
      include: [{
        model: Book,
        where: { id: bookId },
      }],
      where: { id },
    });
    const review = {
      title: result.title,
      text: overText(result.overText, result.text),
      overText: result.overText,
      stars: star(result.stars).starArr,
      updatedAt: date(result.updatedAt),
    };
    res.json({
      review,
      starArr,
      starSum,
    });  
  } catch(err) {
    console.error(err);
  }
});
// 리뷰 삭제
router.delete('/:reviewid/:bookid', async (req, res) => {
  try {
    const id = req.params.reviewid;
    const bookId = req.params.bookid;
    await Review.destroy({
      where: { id },
      include: [{
        model: Book,
        where: { id: bookId },
      }],
    });
    const stars = await Review.findAll({
      include: [{
        model: Book,
        where: { id: bookId },
      }],
      attributes: ['stars'],
    });
    const { starArr, starSum } = makeStar(stars);
    res.json({
      starArr,
      starSum,
    });  
  } catch(err) {
    console.error(err);
  }
});
// 삭제 후 새로 추가할 요소를 원할때
router.get('/delete/:bookid/:page', async(req, res) => {
  try {
    const id = req.params.bookid;
    const page = req.params.page;
    const offset = (5 * page) - 1;
    const result = await Review.findOne({
      include: [{
        model: Book,
        where: { id },
      }, {
        model: Member,
        attributes: ['id', 'type', 'nick'],
      }],
      order: [['id', 'DESC']], 
      limit: 1,
      offset,
    });
    const review = {
      id: result.id,
      title: result.title,
      text: overText(result.overText, result.text),
      like: result.like,
      overText: result.overText,
      stars: star(result.stars).starArr,
      createdAt: date(result.createdAt),
      updatedAt: date(result.updatedAt),
      MemberId: result.Member.id,
      type: result.Member.type,
      nick: result.Member.nick,
    };  
    res.json({ review });        
  } catch(err) {
    console.error(err);
  } 
});
// 페이지 버튼 클릭 시
router.get('/page/:bookid/:page', async (req, res) => {
  try {
    const bookId = req.params.bookid;
    const page = req.params.page;
    // 만약 페이지 4를 클릭하면 15개를 건너뛰고 그 다음 5개를 가져와야 한다. 
    // 만약 페이지 5를 클릭하면 20개를 건너뛰고 그 다음 5개를 가져와야 한다. 
    const offset = 5 * (page - 1);
    const results = await Review.findAll({
      include: [{
        model: Book,
        where: { id: bookId },
      }, {
        model: Member,
        attributes: ['id', 'type', 'nick'],
      }],
      offset,
      limit: 5,
      order: [['id', 'DESC']],
    });
    const reviews =  results.map(item => {
      return {
        id: item.id,
        title: item.title,
        text: overText(item.overText, item.text),
        like: item.like,
        overText: item.overText,
        stars: star(item.stars).starArr,
        createdAt: date(item.createdAt),
        updatedAt: date(item.updatedAt),
        MemberId: item.MemberId,
        type: item.Member.type,
        nick: item.Member.nick,  
      }
    });
    res.json({ reviews });  
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;