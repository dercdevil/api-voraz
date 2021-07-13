const express = require('express');
const { check } = require("express-validator");
const { verifyToken, isAdmin } = require('../../middleware');
const router  = express.Router();


const productGalerryController = require('../../controllers/productGallery');


router.post('/product-galleries',[
    verifyToken,
    check("product_id","the product_id is required").not().isEmpty(),
  ],productGalerryController.create)
  router.put('/product-galleries/:id',[verifyToken],productGalerryController.update)
  router.delete('/product-galleries/:id',[verifyToken],productGalerryController.destroy)
  
  
  
module.exports = router