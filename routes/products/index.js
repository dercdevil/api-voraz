const express = require('express');
const { check } = require("express-validator");
const { verifyToken, isAdmin } = require('../../middleware');
const router  = express.Router();
const productController = require('../../controllers/product');

router.get('/products',productController.get)
router.get('/products/:id',productController.getOne)
router.post('/products',[
  verifyToken,
  check("name","the name is required").not().isEmpty(),
  check("price","the price is required").not().isEmpty(),
  check("description","the description is required").not().isEmpty(),
  check("time_for_preparation","the time_for_preparation is required").not().isEmpty(),
],productController.create)
router.put('/products/:id',[verifyToken],productController.update)
router.delete('/products/:id',[verifyToken],productController.destroy)

router.put('/admin-update-product/:id',[verifyToken, isAdmin],productController.updateByAdmin)
router.delete('/admin-delete-product/:id',[verifyToken,isAdmin],productController.destroyByAdmin)
module.exports = router
