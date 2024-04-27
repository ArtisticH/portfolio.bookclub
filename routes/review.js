const express = require('express');
const Review = require('../models/review');

const router = express.Router();

router.route('/')
  .post(async (req, res) => {
    try {
      const review = await Review.create({
        title: req.body.title,
        text: req.body.text,
        overText: req.body.overText,
        stars: req.body.stars,
        BookId: req.body.bookId,
        MemberId: req.user.id,
      });
      res.status(201).json(review);  
    } catch(err) {
      console.error(err);
    }
})

module.exports = router;