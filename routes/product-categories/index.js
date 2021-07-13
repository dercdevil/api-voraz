const express = require('express');
const { check } = require("express-validator");
const { verifyToken, isAdmin } = require('../../middleware');
const productCategoriesController = require('../../controllers/productCategories');

const router  = express.Router();
router.post('/product-categories',[
    verifyToken,
    check("product_id","the product_id is required").not().isEmpty(),
    check("categories","the categories is required").not().isEmpty(),
  ],productCategoriesController.create)

module.exports = router
