const express = require('express');
const { check } = require("express-validator");
const { verifyToken, isAdmin } = require('../../middleware');
const router  = express.Router();

const categoriesController = require('../../controllers/categories');

router.get('/categories',categoriesController.get)
router.post('/categories',[
  verifyToken,
  check("name","the name is required").not().isEmpty(),
],categoriesController.create)
router.put('/categories/:id',[verifyToken],categoriesController.update)
router.delete('/categories/:id',[verifyToken],categoriesController.destroy)

module.exports = router;