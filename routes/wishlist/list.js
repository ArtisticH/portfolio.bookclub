const express = require('express');
const { Member } = require('../../models/main');
const { Folder, List, DoneFolder, DoneList } = require('../../models/wishlist');
const { isLoggedIn } = require('../rest/middlewares');
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
// 처음에 내려보낼때
// 그냥 폴더인지 아니면 읽은 것들인지
router.get('/:done/:folderid/:memberid', async (req, res) => {
  const done = req.params.done;
  const FolderId = req.params.folderid;
  const MemberId = req.params.memberid;
  if(done === 'true') {
    // 카운트, 닉네임, 리스트, 페이지넘버
    let results = await DoneFolder.findOne({
      where: { MemberId },
      attributes: ['count'],
    });
    // 카운트
    const count = results.count;
    // 처음에 15개 보내, 리스트
    results = await DoneList.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      }, {
        model: Folder,
        where: { id: FolderId },
      }],
      limit: 15,
      attributes: ['id','title', 'author', 'img'],
    });
    const done = [];
    results.forEach(item => {
      done[done.length] = {
        id: item.id,
        title: item.title,
        author: item.author,
        img: item.img,
      }
    });
    // 페이지 넘버
    const last = count % 15 === 0 ? count / 15 : Math.floor(count / 15) + 1;
    // 닉네임
    const member = await Member.findOne({
      where: { id: MemberId },
      attributes: ['id', 'nick'],
    });
    res.render('wishlist/donelist', {
      done,
      count,
      member,
    });  
  } else if(done === 'false') {
    // 카운트, 타이틀, 닉네임, 리스트, 페이지넘버, 다른 폴더들
    // 카운트, 타이틀
    let results = await Folder.findOne({
      include: [{
        model: Member,
        where: { id: MemberId },
        attributes: ['id', 'nick']
      }],
      where: { id: FolderId },
      attributes: ['count', 'title'],
    });
    const member = results.Member;
    // 카운트
    const count = results.count;
    const title = results.title;
    // 페이지 넘버
    const last = count % 15 === 0 ? count / 15 : Math.floor(count / 15) + 1;
    // 해당 유저의 다른 폴더들, 근데 현재 폴더는 제외해야 함.
    // 폴더 이동 폼 클릭 시 보여지는 화면
    results = await Folder.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      }],
      where: { id: { [Op.not]: FolderId }},
      attributes: ['id', 'title', 'count'],
    });
    const others = [];
    results.forEach(item => {
      others[others.length] = {
        id: item.id,
        title: item.title,
        count: item.count,
      }
    });
    // 15개만
    results = await List.findAll({
      include: [{
        model: Member,
        where: { id: MemberId },
      }, {
        model: Folder,
        where: { id: FolderId },
      }],
      limit: 15,
      attributes: ['id', 'title', 'author', 'img'],
    });
    const lists = [];
    results.forEach(item => {
      lists[lists.length] = {
        id: item.id,
        title: item.title,
        author: item.author,
        img: item.img,
      }
    });
    res.render('wishlist/list', {
      member,
      lists,
      title,
      others,
      count,
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
  });
  // 폴더에서 count추가
  await Folder.increment('count', {
    include: [{
      model: Member,
      where: { id: MemberId },
    }],
    by: 1,
    where: { id: FolderId },
  });
  res.json({ list });
});
// 리스트 삭제할때
router.delete('/', async(req, res) => {
  const FolderId = req.body.FolderId;
  const MemberId = req.body.MemberId;
  // 어느 페이지에서 삭제했는지
  const page = req.body.page;
  // 몇 개 내려보내야 하는지 == 몇 개 삭제했는지
  // count가 15라면 마지막 페이지에서 남은 하나 삭제 후 이전 페이지의 15개를 보내야 하고, 
  // 아니라면 최대 삭제한 만큼만의 값을 보내야 한다.
  const count = +req.body.count;
  // 삭제할 친구들 아이디
  const ids = JSON.parse(req.body.id);
  // 삭제하고
  await List.destroy({
    where: { id: ids },
  });
  // 줄이고
  await Folder.decrement('count', {
    include: [{
      model: Member,
      where: { id: MemberId },
    }],
    by: ids.length,
    where: { id: FolderId },
  });
  function aboutOffset() {
    let offset;
    if(count === 15) {
      offset = (page - 2) * 15;
    } else {
      offset = (page - 1) * 15 + (15 - count);
    }
    return offset;
  }
  // 그냥 삭제만 필요한 경우 아무것도 안 보낸다.
  if(count === 0) {
    return res.json({});
  }
  const results = await List.findAll({
    include: [{
      model: Member,
      where: { id: MemberId },
    }, {
      model: Folder,
      where: { id: FolderId },
    }],
    // 몇 개 내려보내야 하는지
    limit: count,
    // 앞에서부터 몇번째의 리스트를 가져와야 하는지
    offset: aboutOffset(),
    attributes: ['id', 'title', 'author', 'img'],
  });
  const lists = [];
  results.forEach(item => {
    lists[lists.length] = {
      id: item.id,
      img: item.img,
      title: item.title,
      author: item.author,
    }
  });
  res.json({ lists });
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
  const deletedCount = elemIds.length;
  const restCount = 15 - deletedCount;
  const page = req.body.page;
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
  });
  // 읽은 것들 업데이트
  const doneLists = await List.findAll({
    include: [{
      model: Member,
      where: { id: MemberId },
    }],
    where: { done: true },
    attributes: ['id', 'img', 'title', 'author'],
  });
  doneTotalLists = [];
  doneLists.forEach(item => {
    doneTotalLists[doneTotalLists.length] = {
      id: item.id,
      img: item.img,
      title: item.title,
      author: item.author,
    }
  });
  totalLists = [];
  // 현재 폴더 업데이트
  const updatedLists = await List.findAll({
    include: [{
      model: Member,
      where: { id: MemberId },
    }, {
      model: Folder,
      where: { id: FolderId },
    }],
    where: { done: false },
    attributes: ['id', 'img', 'title', 'author'],
  });
  updatedLists.forEach(item => {
    totalLists[totalLists.length] = {
      id: item.id,
      img: item.img,
      title: item.title,
      author: item.author,
    }
  });
  doneTotalLength = doneTotalLists.length;
  totalListLength = totalLists.length;
  const last = totalListLength % 15 === 0 ? totalListLength / 15 : Math.floor(totalListLength / 15) + 1;
  // 빈 자리 메꾸게 보낼 것들
  const afterDelete = await List.findAll({
    include: [{
      model: Member,
      where: { id: MemberId },
    }, {
      model: Folder,
      where: { id: FolderId },
    }],
    where: { done: false },
    // 삭제한 만큼 메꿔주고
    limit: deletedCount,
    // 앞에서부터 몇번째의 리스트를 가져와야 하는지
    offset: (page - 1) * 15 + restCount,
    attributes: ['id', 'img', 'title', 'author'],
  });
  const lists = [];
  afterDelete.forEach(item => {
    lists[lists.length] = {
      id: item.id,
      img: item.img,
      title: item.title,
      author: item.author,
    }
  });
  res.json({ lists, last });
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
  let lists;
  if(done) {
    const end = doneTotalLength < start + 15 ? doneTotalLength : start + 15;
    lists = doneTotalLists.slice(start, end);
  } else {
    const end = totalListLength < start + 15 ? totalListLength : start + 15;
    console.log(start, end);
    lists = totalLists.slice(start, end);
  }
  res.json({
    lists: JSON.stringify(lists),
  });
});
module.exports = router;