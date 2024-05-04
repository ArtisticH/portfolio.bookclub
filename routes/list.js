const express = require('express');
const Member = require('../models/member');
const Folder = require('../models/folder');
const List = require('../models/list');
const { funChangeDate } = require('../routes/tools');

const router = express.Router();

router.get('/:folderid/:memberid', async (req, res) => {
  const FolderId = req.params.folderid;
  const MemberId = req.params.memberid;
  const lists = await List.findAll({
  });
  res.render('list', {});
});

module.exports = router;