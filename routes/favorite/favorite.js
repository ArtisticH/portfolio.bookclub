const express = require('express');
const Favorite = require('../../models/favorite');
const TS = require('../../models/ts');
const POP = require('../../models/pop');
const KPOP = require('../../models/kpop');
const KFC = require('../../models/kfc');
const HFC = require('../../models/hfc');
const HMC = require('../../models/hmc');
const KMC = require('../../models/kmc');
const RecordFavortie = require('../../models/recordsFavorite');
const { sequelize } = require('../../models');

const router = express.Router();

router.get('/:id/:round', async (req, res) => {
  const id = req.params.id;
  const model = await Favorite.findOne({
    where: { id },
    attributes: ['modelName', 'title', 'types', 'explanation'],
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
      selected: result.selected,
      win: result.win,
      finalWin: result.finalWin,
    }
  })
  res.render('tournament', {
    original: JSON.stringify(arr),
    model: model.modelName,
    title: model.title,
    types: model.types,
    explanation: model.explanation,
    id,
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
  // await RecordFavortie.create({
  //   FavoriteId: id,
  //   MemberId,
  //   main,
  //   sub,
  // })
  res.json({})
});

module.exports = router;