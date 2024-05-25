const express = require('express');
const { Member } = require('../../models/main');
const { Folder, List, DoneFolder } = require('../../models/wishlist');
const { Op } = require('sequelize');
const path = require('path');
const multer = require('multer');

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

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

const totalLists = [];
const doneTotalLists = [];

router.get('/:done/:folderid/:memberid', async (req, res) => {
  if(!req.user) {
    res.redirect('/?wishlist=login');
    return;
  }
  const done = req.params.done;
  if(done === 'true') {
    const MemberId = req.params.memberid;
    const doneFolder = await DoneFolder.findOne({
      where: { MemberId },
      attributes: ['count'],
    });
    const count = doneFolder.count;
    const results = await List.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      }],
      where: { done: true },
      attributes: ['id', 'img', 'title', 'author'],
    });
    results.forEach(item => {
      doneTotalLists[doneTotalLists.length] = {
        id: item.id,
        img: item.img,
        title: item.title,
        author: item.author,
      }
    });
    const last = count % 15 === 0 ? count / 15 : Math.floor(count / 15) + 1;
    const doneLists = doneTotalLists.slice(0, 15);
    const member = await Member.findOne({
      where: { id: MemberId },
      attributes: ['id', 'nick'],
    });
    res.render('wishlist/donelist', {
      doneLists,
      count,
      member,
      last, 
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
    const member = currentFolder.Member;
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
    const results = await List.findAll({
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
    results.forEach(item => {
      totalLists[totalLists.length] = {
        id: item.id,
        title: item.title,
        author: item.author,
        img: item.img,
      }
    });
    const totalLength = results.length;
    const last = results.length % 15 === 0 ? results.length / 15 : Math.floor(results.length / 15) + 1;
    const lists = totalLists.slice(0, 15);
    res.render('wishlist/list', {
      member,
      lists,
      folders,
      totalLength,
      currentFolder,
      last,
    });  
  }
});
// 파일을 올릴때
router.post('/preview', upload.single('image'), (req, res) => {
  const url = `/image/${req.file.filename}`;
  res.json({ url });
});
const upload2 = multer();
// 리스트 추가할때
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
// 리스트 삭제할때
router.delete('/', async(req, res) => {
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
  // 현재 폴더 아이디
  const currentFolderId = req.body.currentFolderId;
  // 이동할 폴더 아이디
  const targetId = req.body.targetId;
  // 이동할 리스트 아이디
  const elemIds = JSON.parse(req.body.elemIds);
  // 먼저 이동할 아이들의 FolderId 바꿔주기
  await List.update({
    FolderId: targetId,
  }, {
    where: { id: elemIds },
  });
  // 현재 폴더에서 빠져나간 만큼 빼주기
  await Folder.decrement('count', {
    by: elemIds.length,
    where: { id: currentFolderId },
  })
  // 이사간 애들만큼 더해주기
  await Folder.increment('count', {
    by: elemIds.length,
    where: { id: targetId },
  });
  const counts = await Folder.findAll({
    include: [{
      model: Member,
      where: { id: MemberId },
    }],
    where: { id: { [Op.not]: currentFolderId }},
    attributes: ['count'],
  });
  res.json({ counts });
});
// 완독버튼
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
// 완독 해제
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
  // 방금 바꾼 녀석들을 다시 불러와
  // 원래 폴더에 넣어주는 작업
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
  // 그래서 { 폴더ID: 몇개, 폴더ID: 몇개.. }이런 식으로
  const obj = {};
  FolderId.forEach(id => {
    obj[id] = (obj[id] == undefined) ? 1 : (obj[id] + 1);
  });
  // 바꿀 폴더 ID 배열
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
  const increments = id.map(async (folderId) => {
    await Folder.increment('count', {
      by: obj[folderId],
      where: { id: folderId },
    });
  });
  await Promise.all(increments);
  res.json({})
})
// 읽은 것들에서 삭제
router.delete('/done', async (req, res) => {
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
// 페이지네이션
router.post('/page', async (req, res) => {
  const page = req.body.page;
  const done = req.body.done;
  const start = (page - 1) * 15;
  const end = start + 15;
  let lists;
  if(done) {
    lists = doneTotalLists.slice(start, end);
  } else {
    lists = totalLists.slice(start, end);
  }
  res.json({
    lists: JSON.stringify(lists),
  });
});

module.exports = router;