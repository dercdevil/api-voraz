const express = require('express');
const { check } = require("express-validator");
const { verifyToken, isAdmin } = require('../../middleware');
const router  = express.Router();

const carrierAddressController = require("../../controllers/carrierAddresses")
router.post('/carrier-addresses',[
    verifyToken,
    check("carrier_id","the carrier_id is required").not().isEmpty(),
    check("latitude","the latitude is required").not().isEmpty(),
    check("longitude","the longitude is required").not().isEmpty(),
    check("address","the address is required").not().isEmpty(),
  
  ],carrierAddressController.create)
router.put('/carrier-addresses/:id',[verifyToken],carrierAddressController.update)
router.delete('/carrier-addresses/:id',[verifyToken],carrierAddressController.destroy)
module.exports = router;