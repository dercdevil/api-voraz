const express = require('express');
const { verifyToken } = require('../../middleware');
const router  = express.Router();

const channelsController = require('../../controllers/channels');

router.post('/subscription',[
  verifyToken,
],channelsController.subscription)

module.exports = router;