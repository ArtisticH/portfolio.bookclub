const express = require('express');
const Favorite = require('../models/favorite');
const TS = require('../models/ts');
const POP = require('../models/pop');
const KPOP = require('../models/kpop');
const KFC = require('../models/kfc');
const HFC = require('../models/hfc');
const HMC = require('../models/hmc');
const KMC = require('../models/kmc');

const router = express.Router();

router.get('/:id', async (req, res) => {
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
  res.render('ranking', {
    rankings,
    title,
  })
});

module.exports = router;