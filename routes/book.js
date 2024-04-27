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

    const starSum = [...stars].reduce((acc, cur, index, arr) => {
      return index === arr.length - 1 ? (acc + cur.stars) / arr.length : (acc + cur.stars);
    }, 0);

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

    const reviewBoxes = [];

    reviewResults.forEach(item => {
      reviewBoxes[reviewBoxes.length] = {
        title: item.title,
        text: item.text,
        like: item.like,
        overText: item.overText,
        stars: calculateRate(item.stars),
        createdAt: dateChange(item.createdAt),
        MemberId: item.Member.id,
        nick: item.Member.nick,
        type: memberType(item.Member.type),
      }
    });

    console.log(reviewBoxes);

    res.render('book', {
      book,
      totalBooks,
      member,
      starSum,
      starshapes,
      reviewBoxes,
    });  
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;