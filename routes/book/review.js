const express = require('express');
const { Book, Member, Review } = require('../../models/main');
const db = require('../../models');
const { date, star } = require('../middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
// 클라이언트에서 전송한 리뷰 정보 DB에 저장
// 리뷰 등록
router.post('/', async (req, res) => {
  try {
    if(!req.user) {
      res.redirect('/book?login=need');
      return;
    }
    const bookId = req.body.BookId;
    // 리뷰 등록
    const created = await Review.create({
      title: req.body.title,
      text: req.body.text,
      overText: req.body.overText,
      stars: req.body.stars,
      BookId: bookId,
      MemberId: req.body.MemberId,
    });
    // 방금 등록한 컨텐츠 가져오기
    const result = await Review.findOne({
      include: [{
        model: Book,
      }, {
        model: Member,
        attributes: ['id', 'type', 'nick'],
      }],
      order: [['id', 'DESC']], 
      limit: 1,
      where: { id: created.id },
    });
    const stars = await Review.findAll({
      include: [{
        model: Book,
        where: { id: bookId },
      }],
      attributes: ['stars'],
    });
    let sum = [...stars].reduce((acc, cur, index, arr) => {
      return index === arr.length - 1 ? (acc + cur.stars) / arr.length : (acc + cur.stars);
    }, 0);
    sum = Math.floor(sum * 10) / 10;
    const { starArr, starSum } = star(sum);
    let text;
    if(result.overText) {
      // 글자 수가 많으면 우선 slice가 보여야 한다.
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
});
// 좋아요 취소
router.post('/like/cancel', async (req, res) => {
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
});
// 클라이언트에서 수정 버튼 누르면 해당 데이터가 담긴 리뷰 폼을 띄우기 위해
// 해당 데이터를 보내줘야 한다.
router.get('/:reviewid', async(req, res) => {
  const id = req.params.reviewid;
  const review = await Review.findOne({
    where: { id },
  });
  res.json({ review });  
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
    });
    const stars = await Review.findAll({
      include: [{
        model: Book,
        where: { id: bookId },
      }],
      attributes: ['stars'],
    });
    let sum = [...stars].reduce((acc, cur, index, arr) => {
      return index === arr.length - 1 ? (acc + cur.stars) / arr.length : (acc + cur.stars);
    }, 0);
    sum = Math.floor(sum * 10) / 10;
    const { starArr, starSum } = star(sum);
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
  const id = req.params.reviewid;
  const bookId = req.params.bookid;
  await Review.destroy({
    where: { id },
  });
  const stars = await Review.findAll({
    include: [{
      model: Book,
      where: { id: bookId },
    }],
    attributes: ['stars'],
  });
  let sum = [...stars].reduce((acc, cur, index, arr) => {
    return index === arr.length - 1 ? (acc + cur.stars) / arr.length : (acc + cur.stars);
  }, 0);
  sum = Math.floor(sum * 10) / 10;
  const { starArr, starSum } = star(sum);
  res.json({
    starArr,
    starSum,
  });
});

// 삭제 후 새로 추가할 요소를 원할때
router.get('/delete/:bookid/:page', async(req, res) => {
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
  console.log(result);
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
    stars: star(result.stars).starArr,
    createdAt: date(result.createdAt),
    updatedAt: date(result.updatedAt),
    MemberId: result.Member.id,
    type: result.Member.type,
    nick: result.Member.nick,
  };  
  res.json({ review });      
});
// 페이지 버튼 클릭 시
router.get('/page/:bookid/:page', async (req, res) => {
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
  const reviews = [];
  results.forEach(item => {
    let text;
    if(item.text.length > 200) {
      text = {
        slice: item.text.slice(0, 200),
        original: item.text,
      };
    } else {
      text = {
        slice: null,
        original: item.text,
      };
    }  
    reviews[reviews.length] = {
      id: item.id,
      title: item.title,
      text,
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
});

module.exports = router;