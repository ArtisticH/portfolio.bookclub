const express = require('express');
const { Favorite, TS, POP, KPOP, HFC, KFC, HMC, KMC } = require('../../models/favorite');
const { sequelize } = require('../../models');

function totalGame(arr) {
  const finalWin = arr.map(item => {
    return item.finalWin;
  });
  return Math.max(...finalWin);
}
function makeRanking(arr, modelName, total) {
  const lists = arr.map(item => {
    return {
      main: item.main,
      sub: item.sub,
      // 0 / 0으로 나눌때 NaN
      victoryRate: isNaN(+item.win / +item.selected) ? 0 : Math.floor((+item.win / +item.selected) * 100),
      winningRate: isNaN(+item.finalWin / total) ? 0 :  Math.floor((+item.finalWin / total) * 100),
      modelName,
    }
  });
  return lists;
}
const descending = (arr, key) => {
  return arr.sort((a, b) => b[key] - a[key]);
}

const router = express.Router();

router.get('/', async (req, res) => {
  const favorites = await Favorite.findAll({});
  res.render('favorite/favorite', { favorites });
});

// 랭킹
router.get('/ranking/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Favorite.findOne({
      where: { id },
      attributes: ['modelName', 'title'],
    });
    const modelName = item.modelName;
    const title = item.title;
    let items;
    let total;
    let lists;
  
    switch(modelName) {
      case 'TS':
        items = await TS.findAll({});
        total = totalGame(items);
        lists = makeRanking(items, modelName, total);
        break;
      case 'POP':
        items = await POP.findAll({});
        total = totalGame(items);
        lists = makeRanking(items, modelName, total);
        break;
      case 'KPOP':
        items = await KPOP.findAll({});
        total = totalGame(items);
        lists = makeRanking(items, modelName, total);
        break;
      case 'HFC':
        items = await HFC.findAll({});
        total = totalGame(items);
        lists = makeRanking(items, modelName, total);
        break;
      case 'KFC':
        items = await KFC.findAll({});
        total = totalGame(items);
        lists = makeRanking(items, modelName, total);
        break;
      case 'HMC':
        items = await HMC.findAll({});
        total = totalGame(items);
        lists = makeRanking(items, modelName, total);
        break;
      case 'KMC':
        items = await KMC.findAll({});
        total = totalGame(items);
        lists = makeRanking(items, modelName, total);
        break;                              
    }
    lists = descending(lists, 'winningRate');
    res.render('favorite/ranking', {
      lists,
      total,
      title,
    });  
  } catch(err) {
    console.error(err);
  }
});

router.get('/:id/:round', async (req, res) => {
  try {
    const id = req.params.id;
    const model = await Favorite.findOne({
      where: { id },
      attributes: ['modelName', 'title', 'types', 'explanation'],
    });
    const modelName = model.modelName;
    let results;
    if(modelName === 'TS') {
      results = await TS.findAll({});
    } else if(modelName === 'POP') {
      results = await POP.findAll({});
    } else if(modelName === 'KPOP') {
      results = await KPOP.findAll({});
    } else if(modelName === 'KFC') {
      results = await KFC.findAll({});
    } else if(modelName === 'HFC') {
      results = await HFC.findAll({});
    } else if(modelName === 'HMC') {
      results = await HMC.findAll({});
    } else if(modelName === 'KMC') {
      results = await KMC.findAll({});
    }
    // 처음에 보낼땐 0의 값을 보내
    const original = results.map(item => {
      return {
        id: item.id,
        main: item.main,
        sub: item.sub,
        selected: 0,
        win: 0,
        finalWin: 0,
      }
    });
    res.render('favorite/tournament', {
      original: JSON.stringify(original),
      id,
      modelName,
      title: model.title,
      types: model.types,
      explanation: model.explanation,
    });  
  } catch(err) {
    console.error(err);
  }
});
// final
router.post('/final', async (req, res) => {
  try {
    const original = JSON.parse(req.body.original);
    const modelName = req.body.modelName;
    let increments;
    if(modelName === 'TS') {
      increments = original.map(async (obj) => {
        await TS.update({
            selected: sequelize.literal(`selected + ${obj.selected}`),
            win: sequelize.literal(`win + ${obj.win}`),
            finalWin: sequelize.literal(`finalWin + ${obj.finalWin}`)},
          { where: { id: obj.id }});
      });
    } else if(modelName === 'POP') {
      increments = original.map(async (obj) => {
        await POP.update({
            selected: sequelize.literal(`selected + ${obj.selected}`),
            win: sequelize.literal(`win + ${obj.win}`),
            finalWin: sequelize.literal(`finalWin + ${obj.finalWin}`)},
          { where: { id: obj.id }});
      });
    } else if(modelName === 'KPOP') {
      increments = original.map(async (obj) => {
        await KPOP.update({
            selected: sequelize.literal(`selected + ${obj.selected}`),
            win: sequelize.literal(`win + ${obj.win}`),
            finalWin: sequelize.literal(`finalWin + ${obj.finalWin}`)},
          { where: { id: obj.id }});
      });
    } else if(modelName === 'KFC') {
      increments = original.map(async (obj) => {
        await KFC.update({
            selected: sequelize.literal(`selected + ${obj.selected}`),
            win: sequelize.literal(`win + ${obj.win}`),
            finalWin: sequelize.literal(`finalWin + ${obj.finalWin}`)},
          { where: { id: obj.id }});
      });
    } else if(modelName === 'HFC') {
      increments = original.map(async (obj) => {
        await HFC.update({
            selected: sequelize.literal(`selected + ${obj.selected}`),
            win: sequelize.literal(`win + ${obj.win}`),
            finalWin: sequelize.literal(`finalWin + ${obj.finalWin}`)},
          { where: { id: obj.id }});
      });
    } else if(modelName === 'HMC') {
      increments = original.map(async (obj) => {
        await HMC.update({
            selected: sequelize.literal(`selected + ${obj.selected}`),
            win: sequelize.literal(`win + ${obj.win}`),
            finalWin: sequelize.literal(`finalWin + ${obj.finalWin}`)},
          { where: { id: obj.id }});
      });
    } else if(modelName === 'KMC') {
      increments = original.map(async (obj) => {
        await KMC.update({
            selected: sequelize.literal(`selected + ${obj.selected}`),
            win: sequelize.literal(`win + ${obj.win}`),
            finalWin: sequelize.literal(`finalWin + ${obj.finalWin}`)},
          { where: { id: obj.id }});
      });
    }
    await Promise.all(increments);
    res.json({});  
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;