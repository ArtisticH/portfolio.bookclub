const express = require('express');
const xml2js = require('xml2js');

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

router.get('/nat/rec', async (req, res) => {
  const url = `https://nl.go.kr/NL/search/openApi/saseoApi.do?key=${process.env.KEY}&startRowNumApi=1&endRowNumApi=100&start_date=20230101&end_date=20240601`;
  const response = await fetch(url);
  const xml = await response.text();
  const data = await parseXMLToJSON(xml);
  const title = '2024 국립중앙도서관 사서추천도서';
  const img = '/img/open/national-rec.png';
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
      contents: list.item.recomcontens,
    }
  });
  const lists = totalLists.slice(0, 12);
  res.render('api', { lists, title, img, last });
});

router.post('/nat/rec', async (req, res) => {
  const page = req.body.page;
  const start = (page - 1) * 12;
  const end = start + 11;
  const lists = totalLists.slice(start, end + 1);
  res.json({
    lists: JSON.stringify(lists),
  });
});

router.get('/search', (req, res) => {
  res.render('api-search');
})

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
      call: item.callo,
      place: item.placeInfo,
      detail: item.detailLink,
      img: item.imageUrl ? `http://cover.nl.go.kr/${item.imageUrl}` : null,
    }
  })
  res.json({
    lists,
  })
})

module.exports = router;