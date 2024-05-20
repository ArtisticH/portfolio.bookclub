const express = require('express');
const xml2js = require('xml2js');
const Folder = require('../models/folder');
const List = require('../models/list');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('open');
});

const parseXMLToJSON = (xml) => {
  return new Promise((resolve, reject) => {
      xml2js.parseString(xml, { explicitArray: false }, (error, result) => {
          if (error) {
              reject(error);
          } else {
              resolve(result);
          }
      });
  });
};

const totalLists = [];
// 추천 도서 가져오기
router.get('/nat', async (req, res) => {
  const url = `https://nl.go.kr/NL/search/openApi/saseoApi.do?key=${process.env.KEY}&startRowNumApi=1&endRowNumApi=100&start_date=20230101&end_date=20240601`;
  const response = await fetch(url);
  const xml = await response.text();
  const data = await parseXMLToJSON(xml);
  const title = '2024 국립중앙도서관 사서추천도서';
  const img = '/img/open/national.png';
  const length = data.channel.list.length;
  const last = length % 12 === 0 ? length / 12 : Math.floor(length / 12) + 1;
  data.channel.list.forEach((list) => {
    totalLists[totalLists.length] = {
      title: list.item.recomtitle,
      author: list.item.recomauthor,
      publisher: list.item.recompublisher,
      img: list.item.recomfilepath,
      date: `${list.item.publishYear}.${list.item.recomMonth}`,
      codeName: list.item.drCodeName,
    }
  });
  const lists = totalLists.slice(0, 12);
  res.render('api', { lists, title, img, last });
});
// 알라딘 도서 가져오기
router.get('/aladin', async (req, res) => {
  const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${process.env.ALADIN}&QueryType=Bestseller&start=1&MaxResults=100&Output=JS&Version=20131101&SearchTarget=Book&CategoryId=1&Cover=Big`;
  const response = await fetch(url);
  const json = await response.json();
  const title = '알라딘 베스트셀러 리스트 - 소설/시/희곡';
  const img = '/img/open/aladin-list.png';
  const length = json.item.length;
  const last = length % 12 === 0 ? length / 12 : Math.floor(length / 12) + 1;
  json.item.forEach((item) => {
    totalLists[totalLists.length] = {
      title: item.title,
      author: item.author,
      publisher: item.publisher,
      img: item.cover,
      date: item.pubDate,
      codeName: item.categoryName,
    }
  });
  const lists = totalLists.slice(0, 12);
  res.render('api', { lists, title, img, last });
})
// 페이커
router.get('/faker', async (req, res) => {
  const url = 'http://localhost:8081/api';
  const response = await fetch(url);
  const json = await response.json();
  const title = '다독가 페이커의 독서목록';
  const img = '/img/open/faker-list.png';
  const length = json.data.length;
  const last = length % 12 === 0 ? length / 12 : Math.floor(length / 12) + 1;
  json.data.forEach((item) => {
    totalLists[totalLists.length] = {
      title: item.title,
      author: item.author,
      publisher: item.pub,
      img: `http://localhost:8081/${item.img}`,
    }
  });
  const lists = totalLists.slice(0, 12);
  console.log(lists);
  res.render('api', { lists, title, img, last });
})
// 추천 도서 페이지네이션
router.post('/list', async (req, res) => {
  const page = req.body.page;
  const start = (page - 1) * 12;
  const end = start + 11;
  const lists = totalLists.slice(start, end + 1);
  res.json({
    lists: JSON.stringify(lists),
  });
});
// 소장자료 검색 페이지
router.get('/search', (req, res) => {
  const explanation = '국립중앙도서관 오프라인 도서 자료 검색 결과를 10건 반환합니다.';
  res.render('api-search', { explanation });
});

// 소장 자료 검색 결과 반환
router.post('/search', async (req, res) => {
  const target = req.body.target;
  const kwd = req.body.kwd;
  const url = `
  https://www.nl.go.kr/NL/search/openApi/search.do?key=${process.env.KEY}&apiType=json&systemType=${encodeURIComponent('오프라인자료')}&category=${encodeURIComponent('도서')}&pageSize=10&pageNum=1&srchTarget=${encodeURIComponent(target)}&kwd=${encodeURIComponent(kwd)}
  `;
  const response = await fetch(url);
  const json = await response.json();
  const lists = [];
  json.result.forEach(item => {

    lists[lists.length] = {
      title: item.titleInfo,
      author: item.authorInfo,
      pub: item.pubInfo,
      year: item.pubYearInfo,
      call: item.callNo,
      place: item.placeInfo,
      detail: `https://www.nl.go.kr${item.detailLink}`,
      img: item.imageUrl ? `http://cover.nl.go.kr/${item.imageUrl}` : null,
    }
  })
  res.json({
    lists,
  });
});
// 폴더 내용 불러오기
router.get('/wishlist/:memberid', async (req, res) => {
  const MemberId = req.params.memberid;
  const results = await Folder.findAll({
    where: { MemberId },
  });
  res.json({
    folders: JSON.stringify(results),
  });  
});
// 새로운 폴더 추가
router.post('/folder', async (req, res) => {
  const MemberId = req.body.MemberId;
  const title = req.body.title;
  const isPublic = req.body.isPublic === 'public' ? true : false;
  const lists = JSON.parse(req.body.lists);
  if(!MemberId) {
    res.redirect('/open/nat/rec/?login=need');
  }
  const folder = await Folder.create({
    title,
    MemberId,
    public: isPublic,
    count: lists.length,
  });
  const create = lists.map(async (item) => {
    await List.create({
      FolderId: folder.id,
      title: item.title,
      author: item.author,
      img: item.img,
      MemberId,
    });
  });
  await Promise.all(create);
  res.json({});
});
// 기존 폴더에 추가
router.post('/exist', async (req, res) => {
  const MemberId = req.body.MemberId;
  const FolderId = req.body.FolderId;
  const lists = JSON.parse(req.body.lists);
  if(!MemberId) {
    res.redirect('/open/nat/rec/?login=need');
  }
  await Folder.increment('count', {
    by: lists.length,
    where: { id: FolderId },
  })
  const create = lists.map(async (item) => {
    await List.create({
      FolderId,
      title: item.title,
      author: item.author,
      img: item.img,
      MemberId,
    });
  });
  await Promise.all(create);
  res.json({});
})


module.exports = router;