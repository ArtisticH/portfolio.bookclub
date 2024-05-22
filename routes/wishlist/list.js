const express = require('express');
const Member = require('../../models/member');
const Folder = require('../../models/folder');
const List = require('../../models/list');
const DoneFolder = require('../../models/donefolder');
const { Op } = require('sequelize');
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

router.get('/:done/:folderid/:memberid', async (req, res) => {
  const done = req.params.done;
  if(done === 'true') {
    const MemberId = req.params.memberid;
    const doneFolder = await DoneFolder.findOne({
      where: { MemberId },
      attributes: ['count'],
    });
    const count = doneFolder.count;
    const doneLists = await List.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      }],
      where: { done: true },
      attributes: ['id', 'img', 'title', 'author']
    })
    const member = await Member.findOne({
      where: { id: MemberId },
      attributes: ['id', 'nick'],
    })
    res.render('donelist', {
      doneLists,
      count,
      member,
    });  
  } else if(done === 'false') {
    const FolderId = req.params.folderid;
    const MemberId = req.params.memberid;
    const currentFolder = await Folder.findOne({
      include: [{
        model: Member,
        where: { id: MemberId },
        attributes: ['id', 'nick']
      }],
      where: { id: FolderId },
      attributes: ['count', 'title'],
    });
    // 해당 유저의 다른 폴더들, 근데 현재 폴더는 제외해야 함.
    // 폴더 이동 폼 클릭 시 보여지는 화면
    const folders = await Folder.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      }],
      where: { id: { [Op.not]: FolderId }},
      attributes: ['id', 'title', 'count'],
    })
    const member = currentFolder.Member;
    const lists = await List.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      }, {
        model: Folder,
        where: { id: FolderId },
      }],
      where: { done: false },
      attributes: ['id', 'title', 'author', 'img'],
    });
    res.render('list', {
      member,
      lists,
      folders,
      currentFolder,
    });  
  }
});

router.post('/preview', upload.single('image'), (req, res) => {
  const url = `/img/${req.file.filename}`;
  res.json({ url });
});

const upload2 = multer();
// 폴더 추가할때
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
// 폴더 삭제할때
router.post('/delete', async(req, res) => {
  const FolderId = req.body.FolderId;
  const lists = JSON.parse(req.body.id);
  await List.destroy({
    where: { id: lists },
  });
  await Folder.decrement('count', {
    by: lists.length,
    where: { id: FolderId },
  })
  res.json({});
});
// 폴더 이동할떄
router.post('/move', async(req, res) => {
  const MemberId = req.body.MemberId;
  // 이동 전 아이디
  const currentFolderId = req.body.currentFolderId;
  // 이동할 아이디
  const targetId = req.body.targetId;
  // 이동할 아이들
  const elemIds = JSON.parse(req.body.elemIds);
  // 1. 먼저 이동할 아이들의 FolderId 바꿔주기
  await List.update({
    FolderId: targetId,
  }, {
    where: { id: elemIds },
  });
  // 2. 현재 폴더에서 빠져나간 만큼 빼주기
  await Folder.decrement('count', {
    by: elemIds.length,
    where: { id: currentFolderId },
  })
  // 3. 이사간 애들만큼 더해주기
  await Folder.increment('count', {
    by: elemIds.length,
    where: { id: targetId },
  });
  const folders = await Folder.findAll({
    include: [{
      model: Member,
      where: { id: MemberId },
    }],
    where: { id: { [Op.not]: currentFolderId }},
    attributes: ['id', 'title', 'count'],
  });
  res.json({ folders });
});

router.post('/read', async (req, res) => {
  const elemIds = JSON.parse(req.body.elemIds);
  const FolderId = req.body.FolderId;
  const MemberId = req.body.MemberId;
  // done항목을 false => true로 바꾸고
  await List.update({
    done: true,
  }, {
    include: [{
      model: Member,
      where: { id: MemberId },
    }, {
      model: Folder,
      where: { id: FolderId },
    }],
    where: { id: elemIds },
  });
  // 현재 담고 있는 폴더의 count 줄이고, 
  await Folder.decrement('count', {
    by: elemIds.length,
    where: { id: FolderId },
  })
  // doneFolder의 count는 늘린다.
  await DoneFolder.increment('count', {
    by: elemIds.length,
    where: { id: MemberId },
  })
  res.json({})
})

router.post('/back', async (req, res) => {
  const elemIds = JSON.parse(req.body.elemIds);
  const MemberId = req.body.MemberId;
  // done항목을 true => false로 바꾸고
  await List.update({
    done: false,
  }, {
    include: [{
      model: Member,
      where: { id: MemberId },
    }],
    where: { id: elemIds },
  });
  const lists = await List.findAll({
    include: [{
      model: Member,
      where: { id: MemberId },
    }, {
      model: Folder,
    }],
    where: { id: elemIds },
  });
  const FolderId = [];
  lists.forEach(list => {
    FolderId[FolderId.length] = list.Folder.id;
  });
  const obj = {};
  FolderId.forEach(id => {
    obj[id] = (obj[id] == undefined) ? 1 : (obj[id] + 1);
  });
  const id = [];
  for(let prop in obj) {
    id[id.length] = prop;
  }
  // doneFolder의 count는 줄이고.
  await DoneFolder.decrement('count', {
    by: elemIds.length,
    where: { id: MemberId },
  })
  // 기존의 폴더를 찾아가 늘리기
  const increments = id.map(async (elemId) => {
    await Folder.increment('count', {
      by: obj[elemId],
      where: { id: elemId },
    });
  });
  await Promise.all(increments);
  res.json({})
})

// 읽은 것들에서 삭제
router.post('/done/delete', async (req, res) => {
  const elemIds = JSON.parse(req.body.elemIds);
  const MemberId = req.body.MemberId;
  // doneFolder의 count는 줄이고.
  await DoneFolder.decrement('count', {
    by: elemIds.length,
    where: { id: MemberId },
  })
  // List에서 삭제하고
  await List.destroy({
    include: [{
      model: Member,
      where: { id: MemberId },
    }],
    where: { id: elemIds },
  });
});

module.exports = router;