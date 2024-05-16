const express = require('express');
const xml2js = require('xml2js');
// const fetch = require('node-fetch');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('open')
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

router.get('/national/recommend', async (req, res) => {
  const url = `https://nl.go.kr/NL/search/openApi/saseoApi.do?key=${process.env.KEY}&startRowNumApi=1&endRowNumApi=20&start_date=20240101&end_date=20240601`;
  const response = await fetch(url);
  const xml = await response.text();
  const data = await parseXMLToJSON(xml);
  const lists = [];
  data.channel.list.forEach(list => {
    lists[lists.length] = {
      title: list.item.recomtitle,
      author: list.item.recomauthor,
      publisher: list.item.recompublisher,
      img: list.item.recomfilepath,
      date: `${list.item.publishYear}.${list.item.recomMonth}`,
      codeName: list.item.drCodeName,
      contents: list.item.recomcontens,
    }
  });
  res.render('api', { lists })
});


module.exports = router;