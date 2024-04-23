const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/books', (req, res) => {
  res.render('books');
});

router.get('/members', (req, res) => {
  res.render('members');
});

router.get('/meetings', (req, res) => {
  res.render('meetings');
});

router.get('/fun', (req, res) => {
  res.render('fun');
});

module.exports = router;