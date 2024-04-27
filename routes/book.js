const express = require('express');
const Book = require('../models/book');
const Member = require('../models/member');
const Review = require('../models/review');

const router = express.Router();

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

    const reviewBoxes = await Review.findAll({
      include: [{
        model: Book,
        where: { id: req.params.id}
      }, {
        model: Member,
        where: { id: req.user.id }
      }], 
    });

    console.log(
      reviewBoxes,
      reviewBoxes.Books,
      reviewBoxes.Members,
    )

    res.render('book', {
      book,
      totalBooks,
      member,
      starSum,
      starshapes,
    });  
  } catch(err) {
    console.error(err);
  }
});

function calculateRate(star) {
  let array = [];

  if(star % 1 === 0) {
    array = Array.from({ length: 5 }, (_, index) => {
      if(index + 1 <= star) {
        return 'full';
      } else {
        return 'empty';
      }  
    });

  } else {
    let decimal = star % 1;
    const essence = Math.floor(star);

    if (decimal < 0.5) {
      decimal = 0;
    } else if (0.5 <= decimal) {
      decimal = 0.5;
    }

    array = Array.from({ length: 5 }, (_, index) => {
      if(index + 1 <= essence) {
        return 'full';
      } else if(index + 1 === essence + 1 && decimal === 0.5) {
        return 'half';
      } else {
        return 'empty';
      }  
    });
  }
  return array;
}

module.exports = router;