const express = require('express');
const Member = require('../models/member');
const Folder = require('../models/folder');
const DoneFolder = require('../models/donefolder');
const { date } = require('../routes/tools');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/:memberid', async (req, res) => {
  const id = req.params.memberid;
  const member = await Member.findOne({
    where: { id },
    attributes: ['id', 'nick'],
  });
  let results;
  if(res.locals.sort === 'default') {
    results = await Folder.findAll({
      include: [{
        model: Member,
        where: { id },
      }],
    });  
  } else if(res.locals.sort = 'name') {
    results = await Folder.findAll({
      include: [{
        model: Member,
        where: { id },
      }],
      order: [['title', 'ASC']], 
    });  
  } else if(res.locals.sort = 'updatedAt') {
    results = await Folder.findAll({
      include: [{
        model: Member,
        where: { id },
      }],
      order: [['updatedAt', 'ASC']], 
    });  
  } else if(res.locals.sort = 'createdAt') {
    results = await Folder.findAll({
      include: [{
        model: Member,
        where: { id },
      }],
      order: [['createdAt', 'ASC']], 
    });  
  }
  const folders = [];
  results.forEach(result => {
    folders[folders.length] = {
      id: result.id,
      title: result.title,
      count: result.count,
      public: result.public,
      createdAt: date(result.createdAt),
      updatedAt: date(result.updatedAt),
    }
  });
  const done = await DoneFolder.findOne({
    where: { MemberId: id },
    attributes: ['count', 'public'],
  });
  res.render('wishlist', {
    folders,
    done,
    member,
  })
});
// 폴더 생성
router.post('/folder', async (req, res) => {
  const MemberId = req.body.id;
  const title = req.body.title;
  const isPublic = req.body.isPublic === 'public' ? true : false;
  const result = await Folder.create({
    title,
    public: isPublic,
    MemberId,
  });
  const folder = {
    id: result.id,
    title: result.title,
    count: result.count,
    public: result.public,
    createdAt: date(result.createdAt),
    updatedAt: date(result.updatedAt),
  };
  const done = await DoneFolder.findOne({
    where: { MemberId },
    attributes: ['count', 'public'],
  });
  res.json({
    folder,
    done,
  });
});
// 폴더 이름 변경
router.patch('/folder', async (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  await Folder.update({
    title,
  }, {
    where: { id },
  });
  const result = await Folder.findOne({
    where: { id },
    attributes: ['title', 'updatedAt'],
  });
  const folder = {
    title: result.title,
    updatedAt: result.updatedAt,
  };
  res.json({ folder });
});

// 폴더 삭제
router.delete('/:folderid', async (req, res) => {
  const id = req.params.folderid;
  await Folder.destroy({
    where: { id },
  });
  res.json({});
});

// 폴더 공개 / 비공개 변경
router.patch('/public', async (req, res) => {
  const id = req.body.id;
  const isPublic = req.body.public;
  const done = req.body.done;
  if(done) {
    await DoneFolder.update({
      public: isPublic,
    }, {
      where: { MemberId: id },
    });
    const result = await DoneFolder.findOne({
      where: { MemberId: id },
      attributes: ['public'],
    });
    const done = {
      public: result.public,
    };
    res.json({ done });  
  } else {
    await Folder.update({
      public: isPublic,
    }, {
      where: { id },
    });
    const result = await Folder.findOne({
      where: { id },
      attributes: ['public', 'updatedAt'],
    });
    const folder = {
      public: result.public,
      updatedAt: result.updatedAt,
    };
    res.json({ folder });  
  }
});

router.post('/sort', (req, res) => {
  const sort = req.body.sort;
  switch(sort) {
    case 'name':
      res.locals.sort = 'name';
      break;
    case 'updatedAt':
      res.locals.sort = 'updatedAt';
      break;
    case 'createdAt':
      res.locals.sort = 'createdAt';
      break;
  }
    res.json({});  
});



module.exports = router;