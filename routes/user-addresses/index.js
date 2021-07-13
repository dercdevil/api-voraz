const express = require('express');
const { check } = require("express-validator");
const { verifyToken } = require('../../middleware');
const router  = express.Router();
const userAddressController = require('../../controllers/userAdress');

router.get('/user-addresses',[verifyToken],userAddressController.get);
router.post('/user-addresses',[
  verifyToken,
  check("latitude","the latitude is required").not().isEmpty(),
  check("longitude","the longitude is required").not().isEmpty(),
  check("address","the address is required").not().isEmpty(),
  check("description","the description is required").not().isEmpty(),
  check("city","the city is required").not().isEmpty(),
],userAddressController.create)
router.put('/user-addresses/:id',[verifyToken],userAddressController.update)
router.delete('/user-addresses/:id',[verifyToken],userAddressController.destroy)
module.exports = router;