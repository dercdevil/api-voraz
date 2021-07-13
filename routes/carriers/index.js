const express = require('express');
const { check } = require("express-validator");
const { verifyToken } = require('../../middleware');
const router  = express.Router();

const carrierController = require('../../controllers/carriers');
router.get('/carriers',[verifyToken],carrierController.get)
router.post('/carriers',[
  verifyToken,
  check("name","the is required").not().isEmpty(),
  check("phone","the is required").not().isEmpty(),
  check("radio","the is required").not().isEmpty(),
  check("base_price","the is required").not().isEmpty(),
  check("extra_price","the is required").not().isEmpty(),
  check("extra_distance","the is required").not().isEmpty(),
],carrierController.create)
router.put('/carriers/:id',[verifyToken],carrierController.update)
router.delete('/carriers/:id',[verifyToken],carrierController.destroy)
module.exports = router;