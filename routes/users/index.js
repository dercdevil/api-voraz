const express = require('express');
const { check } = require("express-validator");
const { verifyToken, isAdmin } = require('../../middleware');
const router  = express.Router();

const userController = require('../../controllers/user');


router.get('/users',[verifyToken],userController.get)
router.get('/users-all',[verifyToken,isAdmin],userController.getAll)
router.get('/users-sellers',userController.getSeller)
router.post('/users',[
  check("rut","the rut is required").not().isEmpty(),
  check("role","the role is required").not().isEmpty(),
  check("password","the password is required").not().isEmpty(),
],userController.create)
router.put('/users',[verifyToken],userController.update)
router.put('/users/:id',[verifyToken,isAdmin],userController.updateByAdmin)
router.delete('/users/:id',[verifyToken,isAdmin],userController.destroyByAdmin)
router.delete('/users',[verifyToken],userController.destroy)
module.exports = router