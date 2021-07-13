const express = require('express');
const router  = express.Router();

const authController = require('../../controllers/auth');

router.post('/login',authController.login)
router.post('/auth_recovery_pass',authController.recover_password)

module.exports = router
