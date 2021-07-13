const express = require('express');
const { check } = require("express-validator");
const { verifyToken, isAdmin } = require('../../middleware');
const router  = express.Router();
const couponsController = require("../../controllers/coupons");

router.get('/coupons',[verifyToken],couponsController.get)
router.get('/is-coupon-valid/:name',couponsController.isCouponValid)

router.post('/coupons',[
  verifyToken,
  check("discount","is required").not().isEmpty(),
  check("name","is required").not().isEmpty(),
],couponsController.create)
router.post('/create-coupons-by-admin/:user_id',[
  verifyToken,
  isAdmin,
  check("discount","is required").not().isEmpty(),
  check("name","is required").not().isEmpty(),
],couponsController.createByAdmin)
router.put('/coupons/:id',
//[verifyToken],
couponsController.update)
router.delete('/coupons/:id',[verifyToken],couponsController.destroy)
module.exports = router
