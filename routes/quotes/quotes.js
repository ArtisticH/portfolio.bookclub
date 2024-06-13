const express = require('express');
const path = require('path');
const multer = require('multer');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/')
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      console.log(ext);
      cb(null, Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});  

router.get('/', (req, res) => {
  res.render('quotes/quotes');
});
// 이미지 직접 올릴때
router.post('/img', upload.single('image'), (req, res) => {
  try {
    const url = `/img/${req.file.filename}`;
    console.log(url);
    res.json({ url });  
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;