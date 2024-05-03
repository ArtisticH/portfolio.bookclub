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
// 리뷰 등록
// MemberId는 req.user.id 이용
router.post('/', async (req, res) => {
  try {
    // 리뷰 등록
    const createdReview = await Review.create({
      title: req.body.title,
      text: req.body.text,
      overText: req.body.overText,
      stars: req.body.stars,
      BookId: req.body.bookId,
      MemberId: req.user.id,
    });
    // 가장 최근에 등록한 컨텐츠, 내림차순으로 1개
    // 연관된 Book, Member정보도 가져와
    const result = await Review.findOne({
      include: [{
        model: Book,
      }, {
        model: Member,
        attributes: ['id', 'type', 'nick'],
      }],
      order: [['id', 'DESC']], 
      limit: 1,
      where: { id: createdReview.id },
    });
    let text;
    // text가 overText라면 
    // 처음에 slice를 보여주고 더보기를 클릭하면 original을 보여준다. 
    // overText가 아니라면 처음부터 original을 보여주고 slice는 없다. 
    // text는 객체이다. 
    if(result.overText) {
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
      // 숫자를 배열로 변환, 3이면 ['full', 'full', 'full', 'empty', 'empty']이런식으로
      stars: funCalculateRate(result.stars),
      createdAt: funChangeDate(result.createdAt),
      updatedAt: funChangeDate(result.updatedAt),
      MemberId: result.MemberId,
      type: result.Member.type.toUpperCase(),
      nick: result.Member.nick,
    };
    res.json({ review });  
  } catch(err) {
    console.error(err);
  }
});

router.post('/like', async (req, res) => {
  const ReviewId = req.body.id;
  // 먼저 해당 리뷰 글에 작성자가 하트를 클릭한 적 있는지 검사
  const result = await db.sequelize.models.ReviewLike.findOne({
    where: {
      ReviewId,
      MemberId: req.user.id,  
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
      MemberId: req.user.id,
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

router.post('/like/cancel', async (req, res) => {
  const ReviewId = req.body.id;
  // 좋아요 취소
  await Review.decrement('like', {
    by: 1,
    where: { id: ReviewId },
  });
  await db.sequelize.models.ReviewLike.destroy({
    where: {
      ReviewId,
      MemberId: req.user.id,  
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

// 삭제 후 새로 추가할 요소를 원할때
router.get('/delete/:bookid', async(req, res) => {
  const id = req.params.bookid;
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
    // 우선은 가장 최신글 5개 중에 삭제한다고 보고, offset: 4,
    // 만약 페이지네이션이 진행되면 offset에도 변수가 와야한다. 
    offset: 4,
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
    stars: funCalculateRate(result.stars),
    createdAt: funChangeDate(result.createdAt),
    updatedAt: funChangeDate(result.updatedAt),
    MemberId: result.MemberId,
    type: result.Member.type.toUpperCase(),
    nick: result.Member.nick,
  };  
  res.json({ review });      
});

// 업데이트
router.patch('/', async (req, res) => {
  try {
    const id = req.body.id;
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
      stars: funCalculateRate(result.stars),
      updatedAt: funChangeDate(result.updatedAt),
    };
    res.json({ review });  
  } catch(err) {
    console.error(err);
  }
});

// 리뷰 삭제
router.delete('/:reviewid', async (req, res) => {
  const id = req.params.reviewid;
  const bookId = req.params.bookid;
  await Review.destroy({
    where: { id },
  });
  res.json();
});

// 페이지 버튼 클릭 시
router.get('/:bookid/page/:pagenumber', async (req, res) => {
  const bookId = req.params.bookid;
  const pageNumber = req.params.pagenumber;
  // 만약 페이지 4를 클릭하면 15개를 건너뛰고 그 다음 5개를 가져와야 한다. 
  // 만약 페이지 5를 클릭하면 20개를 건너뛰고 그 다음 5개를 가져와야 한다. 
  const offset = 5 * (pageNumber - 1);
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
  for(let i of results) {
    console.log(i.title)
  }
  console.log(results.length);
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
      stars: funCalculateRate(item.stars),
      createdAt: funChangeDate(item.createdAt),
      updatedAt: funChangeDate(item.updatedAt),
      MemberId: item.MemberId,
      type: item.Member.type.toUpperCase(),
      nick: item.Member.nick,  
    }
  });
  res.json({ reviews });
});

module.exports = router;