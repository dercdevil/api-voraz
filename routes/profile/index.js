const express = require('express');
const { check } = require("express-validator");
const { verifyToken, isAdmin } = require('../../middleware');
const router  = express.Router();
const profileController = require('../../controllers/profile');

router.get('/profile',[verifyToken],profileController.get)
router.post('/profile',[
  verifyToken,
  check("name","the name is required").not().isEmpty(),
  check("name_store","is required"),
  check("last_name","the last_name is required").not().isEmpty(), 
  check("email","the email is required").not().isEmpty(),
],profileController.create)
router.put('/profile',[verifyToken],profileController.update);
router.get('/api/stores',profileController.getAll);

module.exports = router
