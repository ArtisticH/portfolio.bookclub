const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('open')
});

router.get('/national/recommend', async (req, res) => {
});


module.exports = router;