const express = require('express');

const router = express.Router();

router.get('/:memberid', async (req, res) => {
  const id = req.params.memberid;
});

module.exports = router;