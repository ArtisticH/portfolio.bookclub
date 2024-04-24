const express = require('express');
const Book = require('../models/book');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/books', async (req, res) => {
  const books = await Book.findAll({});
  res.render('books', { books });
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