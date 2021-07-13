const express = require('express');
const { check } = require("express-validator");
const { verifyToken, isAdmin } = require('../../middleware');
const router  = express.Router();

const inventoriesController = require("../../controllers/inventories");


router.get('/inventories',[
  verifyToken,
],inventoriesController.get);
//router.get('/sell-in-week',inventoriesController.sellInWeek);

router.post('/inventories',[
  verifyToken,
  check("product_id","is required").not().isEmpty(),
  check("day","is required").not().isEmpty(),
  check("time_init","is required").not().isEmpty(),
  check("time_final","is required").not().isEmpty(),
],inventoriesController.create)
router.put('/inventories/:id',[verifyToken],inventoriesController.update)
router.delete('/inventories/:id',[verifyToken],inventoriesController.destroy)


module.exports = router
