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

router.get('/:id/:round', async (req, res) => {
  const id = req.params.id;
  const model = await Favorite.findOne({
    where: { id },
    attributes: ['modelName'],
  });
  let results;
  if(model.modelName === 'TS') {
    results = await TS.findAll({});
  } else if(model.modelName === 'POP') {
    results = await POP.findAll({});
  } else if(model.modelName === 'KPOP') {
    results = await KPOP.findAll({});
  } else if(model.modelName === 'KFC') {
    results = await KFC.findAll({});
  } else if(model.modelName === 'HFC') {
    results = await HFC.findAll({});
  } else if(model.modelName === 'HMC') {
    results = await HMC.findAll({});
  } else if(model.modelName === 'KMC') {
    results = await KMC.findAll({});
  }
  // 가공해서 보내자.
  const arr = [];
  results.forEach(result => {
    arr[arr.length] = {
      id: result.id,
      main: result.main,
      sub: result.sub,
    }
  })
  res.render('tournament', {
    original: JSON.stringify(arr),
    model: model.modelName,
  });
});

module.exports = router;