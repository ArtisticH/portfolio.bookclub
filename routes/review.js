const express = require('express');
const Review = require('../models/review');
const Book = require('../models/book');
const Member = require('../models/member');
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
    const review = await Review.create({
      title: req.body.title,
      text: req.body.text,
      overText: req.body.overText,
      stars: req.body.stars,
      BookId: req.body.bookId,
      MemberId: req.user.id,
    });
    res.json(review);  
  } catch(err) {
    console.error(err);
  }
});

// router.get('/:bookId', async (req, res) => {
//   const bookid = req.params.bookId;

//   const reviewResults = await Review.findAll({
//     include: [{
//       model: Book,
//       where: { id: bookid }
//     }, {
//       model: Member,
//     }], 
//   });

//   reviewResults.reverse();

//   const reviewBoxes = [];

//   reviewResults.forEach(item => {
//     reviewBoxes[reviewBoxes.length] = {
//       title: item.title,
//       text: item.text,
//       like: item.like,
//       overText: item.overText,
//       stars: calculateRate(item.stars),
//       createdAt: dateChange(item.createdAt),
//       MemberId: item.Member.id,
//       nick: item.Member.nick,
//       type: item.Member.type.toUpperCase(),
//     }
//   });

//   res.json(reviewBoxes);  
// });

// router.get('/:bookid/page/:pagenumber', async (req, res) => {
//   const bookId = req.params.bookid;
//   const pageNumber = req.params.pagenumber;
//   const reviews = await Review.findAll({
//     include: [{
//       model: Book,
//       where: { id: bookId }
//     }, {
//       model: Member,
//     }], 
//   });
//   const offset = reviews.length - 5 * pageNumber;
//   const results = await Review.findAll({
//     include: [{
//       model: Book,
//       where: { id: bookId }
//     }, {
//       model: Member,
//     }], 
//     offset,
//     limit: 5,
//   });
//   results.reverse();
//   res.json({ results });
// });

module.exports = router;