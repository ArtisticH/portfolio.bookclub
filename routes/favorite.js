const express = require('express');
const Favorite = require('../models/favorite');

const router = express.Router();

router.get('/:id/:round', async (req, res) => {
  const id = req.params.id;
  const round = req.params.round;
  res.render('tournament')
});

module.exports = router;