const express = require('express');
const { check } = require("express-validator");
const { verifyToken, isAdmin } = require('../../middleware');
const webPush = require('web-push');
const router  = express.Router();

const ordersController = require('../../controllers/orders');
router.get('/orders',[verifyToken],ordersController.get)
router.post('/orders',[
  verifyToken,
  check("profile_id","the is required").not().isEmpty(),
  check("reference","the is required").not().isEmpty(),
  check("method","the is required").not().isEmpty(),
  check("total","the is required").not().isEmpty(),
  check("products","the is required").not().isEmpty(),
],ordersController.create)
router.post('/flow/update-status',ordersController.updateStatusOrderByFlow)
router.post('/flow/redirect',ordersController.flowRedirect)
router.put('/orders/:id',[verifyToken],ordersController.update)
router.delete('/orders/:id',[verifyToken],ordersController.destroy)
module.exports = router;