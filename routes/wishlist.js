const express = require('express');
const Member = require('../models/member');
const Folder = require('../models/folder');
const DoneFolder = require('../models/donefolder');
const { funChangeDate } = require('../routes/tools');

const router = express.Router();

router.get('/:memberid', async (req, res) => {
  const id = req.params.memberid;
  const member = await Member.findOne({
    where: { id },
    attributes: ['id', 'nick'],
  });
  const results = await Folder.findAll({
    include: [{
      model: Member,
      where: { id },
    }],
  });
  const folderBoxes = [];
  results.forEach(result => {
    folderBoxes[folderBoxes.length] = {
      id: result.id,
      title: result.title,
      count: result.count,
      public: result.public,
      createdAt: funChangeDate(result.createdAt),
      updatedAt: funChangeDate(result.updatedAt),
    }
  });
  const doneFolder = await DoneFolder.findOne({
    where: { MemberId: id },
  });
  res.json({ folderBoxes, doneFolder, member });
});

module.exports = router;