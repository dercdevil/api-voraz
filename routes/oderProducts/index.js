const express = require('express');
const { check } = require("express-validator");
const { verifyToken, isAdmin } = require('../../middleware');
const router  = express.Router();

const orderProductController = require("../../controllers/orderProducts");


router.get('/sell-in-day/:product_id/:day',[
  verifyToken,
],orderProductController.sellInDay);



module.exports = router
