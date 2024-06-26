const express = require('express');
const { Member } = require('../../models/main');
const { Folder, DoneFolder, Sort, List } = require('../../models/wishlist');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/:memberid', async (req, res) => {
  try {
    const id = req.params.memberid;
    const member = await Member.findOne({
      where: { id },
      attributes: ['nick'],
    });
    const nick = member.nick;
    // 처음에 내려줄때 정렬법을 봐야 한다. 
    const sort = await Sort.findOne({
      where: { MemberId: id },
    })
    let results;
    // 맨처음에 아무것도 없으면 sort는 null
    if(!sort) {
      // 아무것도 전에 지정하지 않았다면 그냥 기본값대로 내려주기
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
    const folders = results.map(result => {
      return {
        id: result.id,
        title: result.title,
        count: result.count,
        public: result.public,
        createdAt: result.createdAt,
      }
    });
    const done = await DoneFolder.findOne({
      where: { MemberId: id },
      attributes: ['count', 'public'],
    });
    res.render('wishlist/wishlist', {
      folders,
      done,
      nick,
    });  
  } catch(err) {
    console.error(err);
  }
});
// 폴더 새롭게 생성
router.post('/folder', async (req, res) => {
  try {
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
    };
    const done = await DoneFolder.findOne({
      where: { MemberId },
      attributes: ['count', 'public'],
    });
    res.json({
      folder,
      done,
    });  
  } catch(err) {
    console.error(err);
  }
});
// 폴더 이름 변경
router.patch('/folder', async (req, res) => {
  try {
    const id = req.body.id;
    const title = req.body.title;
    // 이름 바꾼다. 
    await Folder.update({
      title,
    }, {
      where: { id },
    });
    res.json({});  
  } catch(err) {
    console.error(err);
  }
});
// 폴더 삭제
router.delete('/:folderid/:memberid', async (req, res) => {
  try {
    const id = req.params.folderid;
    const MemberId = req.params.memberid;
    // 리스트 데이터에서 이 유저의, 이 폴더에 속한 리스트 고르기
    const results = await List.findAll({
      include: [{
        model: Folder,
        where: { id },
      }, {
        model: Member,
        where: { id: MemberId },
      }],
      attributes: ["id"],
    });
    const ids = [];
    results.forEach(item => {
      ids[ids.length] = item.id;
    });
    // 폴더 삭제
    await Folder.destroy({
      where: { id },
    });
    // 그리고 리스트에서 삭제
    await List.destroy({
      where: { id: ids },
    });
    res.json({});  
  } catch(err) {
    console.error(err);
  }
});
// 폴더 공개 / 비공개 변경
router.patch('/public', async (req, res) => {
  try {
    const id = req.body.id;
    const isPublic = req.body.public;
    const done = req.body.done;
    if(done) {
      await DoneFolder.update({
        public: isPublic,
      }, {
        where: { MemberId: id },
      });
      res.json({});  
    } else {
      await Folder.update({
        public: isPublic,
      }, {
        where: { id },
      });
      res.json({});  
    }  
  } catch(err) {
    console.error(err);
  }
});
// 데이터베이스에 폴더의 분류 방법을 저장
router.post('/sort', async (req, res) => {
  try {
    const sort = req.body.sort;
    const MemberId = req.body.MemberId;
    const order = req.body.order;
    const updated = req.body.updated;
    const result = await Sort.findOne({
      where: { MemberId },
    });
    if(!result) {
      // 이 유저가 저장한 내용이 없다면 생성
      await Sort.create({
        sort,
        order,
        MemberId
      });  
    } else {
      // 아니라면 업데이트
      await Sort.update({
        sort,
        order,
      }, {
        where: { MemberId },
      });  
    }
    // 분류 기준이 수정일이라면 새로 데이터베이스에서 내려줘야 한다.
    if(updated) {
      const items = await Folder.findAll({
        include: [{
          model: Member,
          where: { id: MemberId },
        }],
        order: [[sort, order]],
      }); 
      const folders = items.map(item => {
        return {
          id: item.id,
          title: item.title,
          count: item.count,
          public: item.public,
          createdAt: item.createdAt,
        }
      });
      res.json({ folders });  
    } else {
      res.json({}); 
    }   
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;