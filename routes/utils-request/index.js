const express = require('express');
const { check } = require("express-validator");
// const { verifyToken } = require('../../middleware');
const router  = express.Router();

const utilsController = require('../../controllers/utilsController');

router.post('/api/send-mail-to',[
    // verifyToken,
    check("to","the is required").not().isEmpty(),
    check("subject","the is required").not().isEmpty(),
    check("title","the is required").not().isEmpty(),
    check("message","the is required").not().isEmpty(),
  ],utilsController.sendMailTo)

module.exports = router
