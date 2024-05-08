const express = require('express');
const Member = require('../models/member');
const Folder = require('../models/folder');
const List = require('../models/list');
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
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});  

router.get('/:folderid/:memberid', async (req, res) => {
  const FolderId = req.params.folderid;
  const MemberId = req.params.memberid;
  const folder = await Folder.findOne({
    include: [{
      model: Member,
      where: { id: MemberId },
      attributes: ['id', 'nick']
    }],
    where: { id: FolderId },
    attributes: ['count'],
  });
  const member = folder.Member;
  const count = folder.count;
  const lists = await List.findAll({
    include: [{
      model: Member,
      where: { id: MemberId },
    }, {
      model: Folder,
      where: { id: FolderId },
    }],
    attributes: ['id', 'title', 'author', 'img'],
  });
  res.render('list', {
    member,
    count,
    lists
  });
});

router.post('/preview', upload.single('image'), (req, res) => {
  console.log('여기')
  const url = `/img/${req.file.filename}`;
  res.json({ url });
});

const upload2 = multer();
router.post('/', upload2.none(), async(req, res) => {
  const img = req.body.img;
  const title = req.body.title;
  const author = req.body.author;
  const MemberId = req.body.MemberId;
  const FolderId = req.body.FolderId;
  const list = await List.create({
    img,
    title,
    author,
    MemberId,
    FolderId,
  })
  // 폴더에서 count추가
  await Folder.increment('count', {
    by: 1,
    where: { id: FolderId },
  });
  res.json({ list });
});

module.exports = router;