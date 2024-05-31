const express = require('express');
const { Favorite, TS, POP, KPOP, HFC, KFC, HMC, KMC } = require('../../models/favorite');
const { sequelize } = require('../../models');

const router = express.Router();

router.get('/', async (req, res) => {
  const favorites = await Favorite.findAll({});
  res.render('favorite/favorite', { favorites });
});

router.get('/:id/:round', async (req, res) => {
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
  // 가공해서 보내자.
  const original = results.map(item => {
    return {
      id: item.id,
      main: item.main,
      sub: item.sub,
      selected: item.selected,
      win: item.win,
      finalWin: item.finalWin,
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
});
// final
router.post('/final', async (req, res) => {
  const id = req.body.id;
  const MemberId = req.body.MemberId;
  const main = req.body.main;
  const sub = req.body.sub;
  const original = JSON.parse(req.body.original);
  const model = await Favorite.findOne({
    where: { id },
    attributes: ['modelName', 'title'],
  });
  const modelName = model.modelName;
  const title = model.title;
  let increments;
  if(modelName === 'TS') {
    increments = original.map(async (obj) => {
      await TS.update(
        {
          selected: sequelize.literal(`selected + ${obj.selected}`),
          win: sequelize.literal(`win + ${obj.win}`),
          finalWin: sequelize.literal(`finalWin + ${obj.finalWin}`)
        },
        {
          where: { id: obj.id }
        }
      );
    });
  } else if(modelName === 'POP') {
    increments = original.map(async (obj) => {
      await POP.update(
        {
          selected: sequelize.literal(`selected + ${obj.selected}`),
          win: sequelize.literal(`win + ${obj.win}`),
          finalWin: sequelize.literal(`finalWin + ${obj.finalWin}`)
        },
        {
          where: { id: obj.id }
        }
      );
    });
  } else if(modelName === 'KPOP') {
    increments = original.map(async (obj) => {
      await KPOP.update(
        {
          selected: sequelize.literal(`selected + ${obj.selected}`),
          win: sequelize.literal(`win + ${obj.win}`),
          finalWin: sequelize.literal(`finalWin + ${obj.finalWin}`)
        },
        {
          where: { id: obj.id }
        }
      );
    });
  } else if(modelName === 'KFC') {
    increments = original.map(async (obj) => {
      await KFC.update(
        {
          selected: sequelize.literal(`selected + ${obj.selected}`),
          win: sequelize.literal(`win + ${obj.win}`),
          finalWin: sequelize.literal(`finalWin + ${obj.finalWin}`)
        },
        {
          where: { id: obj.id }
        }
      );
    });
  } else if(modelName === 'HFC') {
    increments = original.map(async (obj) => {
      await HFC.update(
        {
          selected: sequelize.literal(`selected + ${obj.selected}`),
          win: sequelize.literal(`win + ${obj.win}`),
          finalWin: sequelize.literal(`finalWin + ${obj.finalWin}`)
        },
        {
          where: { id: obj.id }
        }
      );
    });
  } else if(modelName === 'HMC') {
    increments = original.map(async (obj) => {
      await HMC.update(
        {
          selected: sequelize.literal(`selected + ${obj.selected}`),
          win: sequelize.literal(`win + ${obj.win}`),
          finalWin: sequelize.literal(`finalWin + ${obj.finalWin}`)
        },
        {
          where: { id: obj.id }
        }
      );
    });
  } else if(modelName === 'KMC') {
    increments = original.map(async (obj) => {
      await KMC.update(
        {
          selected: sequelize.literal(`selected + ${obj.selected}`),
          win: sequelize.literal(`win + ${obj.win}`),
          finalWin: sequelize.literal(`finalWin + ${obj.finalWin}`)
        },
        {
          where: { id: obj.id }
        }
      );
    });
  }
  await Promise.all(increments);
  res.json({})
});
// 랭킹
router.get('/ranking/:id', async (req, res) => {
  const id = req.params.id;
  const result = await Favorite.findOne({
    where: { id },
    attributes: ['modelName', 'title'],
  });
  const model = result.modelName;
  const title = result.title;
  let results;
  let rankings = [];
  let totalNumberOfGames;

  function totalGame(arr) {
    const finalWin = [];
    arr.forEach(item => {
      finalWin[finalWin.length] = item.finalWin;
    });
    totalNumberOfGames = Math.max(...finalWin);
  }

  function makeRanking(arr) {
    arr.forEach(item => {
      rankings[rankings.length] = {
        main: item.main,
        sub: item.sub,
        victoryRate: isNaN(item.win / item.selected) ? '0.00' : (item.win / item.selected).toFixed(2),
        winningRate: isNaN(item.finalWin / totalNumberOfGames) ? '0.00' : (item.finalWin / totalNumberOfGames).toFixed(2),
        model,
      }
    });
  }

  switch(model) {
    case 'TS':
      results = await TS.findAll({});
      totalGame(results);
      makeRanking(results);
      break;
    case 'POP':
      results = await POP.findAll({});
      totalGame(results);
      makeRanking(results);
      break;
    case 'KPOP':
      results = await KPOP.findAll({});
      totalGame(results);
      makeRanking(results);
      break;
    case 'HFC':
      results = await HFC.findAll({});
      totalGame(results);
      makeRanking(results);
      break;
    case 'KFC':
      results = await KFC.findAll({});
      totalGame(results);
      makeRanking(results);
      break;
    case 'HMC':
      results = await HMC.findAll({});
      totalGame(results);
      makeRanking(results);
      break;
    case 'KMC':
      results = await KMC.findAll({});
      totalGame(results);
      makeRanking(results);
      break;                              
  }

  // victoryRate 내림차순
  rankings.sort((a, b) => parseInt(b.victoryRate) - parseInt(a.victoryRate))
  res.render('favorite/ranking', {
    rankings,
    title,
  })
});

module.exports = router;