const express = require('express');
const xml2js = require('xml2js');
const { Folder, List } = require('../../models/wishlist')

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/', (req, res) => {
  res.render('api/open');
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
// 국립중앙도서관 사서추천도서
const natLists = [];
router.get('/nat', async (req, res) => {
  try {
    // 2023년 1월부터 2024년 6월까지의
    const url = `https://nl.go.kr/NL/search/openApi/saseoApi.do?key=${process.env.NATIONAL_KEY}&startRowNumApi=1&endRowNumApi=100&start_date=20230101&end_date=20240601`;
    const response = await fetch(url);
    const xml = await response.text();
    // xml => JSON
    const data = await parseXMLToJSON(xml);
    const title = '2024 국립중앙도서관 사서추천도서';
    const img = '/img/open/national.png';
    const length = data.channel.list.length;
    const last = length % 12 === 0 ? length / 12 : Math.floor(length / 12) + 1;
    data.channel.list.forEach((list) => {
      natLists[natLists.length] = {
        title: list.item.recomtitle,
        author: list.item.recomauthor,
        publisher: list.item.recompublisher,
        img: list.item.recomfilepath,
        date: `${list.item.publishYear}.${list.item.recomMonth}`,
        codeName: list.item.drCodeName,
      }
    });
    // 12개만 보낼게
    const lists = natLists.slice(0, 12);
    const type = 'nat';
    res.render('api/api', { lists, title, img, last, type });
  } catch(err) {
    console.error(err);
  }
});
// 알라딘 베스트셀러 리스트
const aladinLists = [];
function aladinDate(date) {
  const arr = date.split('-');
  console.log(arr);
  return `${arr[0]}.${arr[1]}`;
}
router.get('/aladin', async (req, res) => {
  try {
    const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${process.env.ALADIN_KEY}&QueryType=Bestseller&start=1&MaxResults=100&Output=JS&Version=20131101&SearchTarget=Book&CategoryId=1&Cover=Big`;
    const response = await fetch(url);
    const json = await response.json();
    const title = '알라딘 베스트셀러 리스트 - 소설/시/희곡';
    const img = '/img/open/aladin-list.png';
    const length = json.item.length;
    const last = length % 12 === 0 ? length / 12 : Math.floor(length / 12) + 1;
    json.item.forEach((item) => {
      aladinLists[aladinLists.length] = {
        title: item.title,
        author: item.author,
        publisher: item.publisher,
        img: item.cover,
        date: aladinDate(item.pubDate),
      }
    });
    const lists = aladinLists.slice(0, 12);
    const type = 'aladin';
    res.render('api/api', { lists, title, img, last, type });  
  } catch(err) {
    console.error(err);
  }
});
// 페이커 독서목록
const fakerLists = [];
router.get('/faker', async (req, res) => {
  try {
    const url = process.env.FAKER;
    const response = await fetch(process.env.FAKER);
    const json = await response.json();
    const title = '다독가 페이커의 독서목록';
    const img = `${process.env.URL}/img/open/faker-list.png`;
    const length = json.data.length;
    const last = length % 12 === 0 ? length / 12 : Math.floor(length / 12) + 1;
    json.data.forEach((item) => {
      // 페이지네이션할때 서버와 통신 없이 미리 받아논 애들을 쓸 수 있게 전부 저장
      fakerLists[fakerLists.length] = {
        title: item.title,
        author: item.author,
        publisher: item.pub,
        img: item.img,
      }
    });
    // 처음에 12개만 보낸다. 
    const lists = fakerLists.slice(0, 12);
    const type = 'faker';
    res.render('api/api', { lists, title, img, last, type });  
  } catch(err) {
    console.error(err);
  }
});
// 추천 도서 페이지네이션
router.post('/list', async (req, res) => {
  try {
    const page = req.body.page;
    const type = req.body.type;
    const start = (page - 1) * 12;
    const end = start + 12;
    // 마지막 미포함
    let lists;
    switch(type) {
      case 'nat':
        // 마지막은 미포함이라 항상 12개임
        lists = natLists.slice(start, end);
        break;
      case 'aladin':
        lists = aladinLists.slice(start, end);
        break;
      case 'faker':
        lists = fakerLists.slice(start, end);
        break;
    }
    res.json({
      lists: JSON.stringify(lists),
    });  
  } catch(err) {
    console.error(err);
  }
});
// 폴더 내용 불러오기
router.get('/folders/:memberid', async (req, res) => {
  try {
    const MemberId = req.params.memberid;
    const results = await Folder.findAll({
      where: { MemberId },
      attributes: ['id', 'title', 'count'],
    });
    const folders = results.map(item => {
      return {
        id: item.id,
        title: item.title,
        count: item.count,
      }
    })
    res.json({ folders });    
  } catch(err) {
    console.error(err);
  }
});
// 기존 폴더에 추가
router.post('/exist', async (req, res) => {
  try {
    // 선택된 아이들을 특정 유저의 특정 폴더에 추가한다.
    const MemberId = req.body.MemberId;
    const FolderId = req.body.FolderId;
    const lists = JSON.parse(req.body.lists);
    // 우선 폴더의 리스트 갯수를 늘리고
    await Folder.increment('count', {
      by: lists.length,
      where: { id: FolderId },
    });
    // 생성한다.
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
  } catch(err) {
    console.error(err);
  }
});
// 새로운 폴더 추가
router.post('/add', async (req, res) => {
  try {
    const MemberId = req.body.MemberId;
    const title = req.body.title;
    const isPublic = req.body.isPublic === 'public' ? true : false;
    const lists = JSON.parse(req.body.lists);
    // 현재 유저의 새로운 폴더를 추가한다. 
    const folder = await Folder.create({
      title,
      MemberId,
      public: isPublic,
      count: lists.length,
    });
    // 방금 추가한 폴더에 리스트들을 저장한다. 
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
  } catch(err) {
    console.error(err);
  }
});
// 국립중앙도서관 소장자료조희
router.get('/search', (req, res) => {
  res.render('api/api-search');
});
// 소장 자료 검색 결과 반환
router.post('/search', async (req, res) => {
  try {
    const target = req.body.target;
    const kwd = req.body.kwd;
    const url = `
    https://www.nl.go.kr/NL/search/openApi/search.do?key=${process.env.NATIONAL_KEY}&apiType=json&systemType=${encodeURIComponent('오프라인자료')}&category=${encodeURIComponent('도서')}&pageSize=10&pageNum=1&srchTarget=${encodeURIComponent(target)}&kwd=${encodeURIComponent(kwd)}
    `;
    const response = await fetch(url);
    const json = await response.json();
    const lists = json.result.map(item => {
      return {
        title: item.titleInfo,
        author: item.authorInfo,
        pub: item.pubInfo,
        year: item.pubYearInfo,
        call: item.callNo,
        place: item.placeInfo,
        detail: `https://www.nl.go.kr${item.detailLink}`,
        img: item.imageUrl ? `http://cover.nl.go.kr/${item.imageUrl}` : '/img/open/book-default.png',
      }
    });
    res.json({ lists });  
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;