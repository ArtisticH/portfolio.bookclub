const express = require('express');
const { Member } = require('../../models/main');
const { Folder, DoneFolder, Sort } = require('../../models/wishlist');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// 처음에 내려줄때
router.get('/:memberid', async (req, res) => {
  // if(!req.user) {
  //   res.redirect('/?wishlist=login');
  //   return;
  // }
  const id = req.params.memberid;
  const member = await Member.findOne({
    where: { id },
    attributes: ['id', 'nick'],
  });
  const sort = await Sort.findOne({
    where: { MemberId: id },
  })
  let results;
  // 맨처음에 아무것도 없으면 sort는 null
  if(!sort) {
    results = await Folder.findAll({
      include: [{
        model: Member,
        where: { id },
      }],
    });  
  } else {
    results = await Folder.findAll({
      include: [{
        model: Member,
        where: { id },
      }],
      order: [[sort.sort, sort.order]],
    }); 
  }
  const folders = [];
  results.forEach(result => {
    folders[folders.length] = {
      id: result.id,
      title: result.title,
      count: result.count,
      public: result.public,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }
  });
  const done = await DoneFolder.findOne({
    where: { MemberId: id },
    attributes: ['count', 'public'],
  });
  res.render('wishlist/wishlist', {
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
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
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
// 데이터베이스에 폴더의 분류 방법을 저장
router.post('/sort', async (req, res) => {
  const sort = req.body.sort;
  const MemberId = req.body.MemberId;
  const order = req.body.order;
  const result = await Sort.findOne({
    where: { MemberId },
  });
  if(!result) {
    await Sort.create({
      sort,
      order,
      MemberId
    });  
  } else {
    await Sort.update({
      sort,
      order,
    }, {
      where: { MemberId },
    });  
  }
  res.json({});  
});


module.exports = router;