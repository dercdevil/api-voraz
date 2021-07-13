const models = require('../models');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
const { sendMail } = require('../utils/email') 
const constants = require('../utils/constants');

async function login(req,res){
  try {
    const { rut,password } = req.body;
    const user = await models.User.findOne({ where: {rut}, include:['profile','user_address']});
    if(!user)  return res.status(404).send({message:"Rut no existe"});
    if(bcrypt.compareSync(password,user.password)){
      delete user.dataValues.password;
      const token = jwt.sign({ id: user.id},constants.secretTokenKey,{
        expiresIn: 86400, // 24 hours
      });
      const { exp: expIn }  = jwt.verify(token, constants.secretTokenKey);

      return res.status(200).send({
        user, 
        token,
        expIn
      });
    }
    return res.status(403).send({message:"clave invalida"});
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function recover_password(req,res){
 try {
    if(!emailValidator.validate(req.body.email))
      res.status(422).json({message: "not found"})
    const user  = await models.User.findOne({
      include: [{
        model : models.Profile,
        where: {email : req.body.email},
        required: true,
        as: 'profile'
      }]
    })
    if(!user){
      res.status(422).json({message: "No se encontro ningún usuario con ese correo"})
    }
    const password = uuidv4();
    user.update({
      password: bcrypt.hashSync(password,10)
    })
    user.save();
    await sendMail({
      to: user.dataValues.profile.email,
      template: "password-reset",
      subject:"recovery password",
      content: {
        password, 
        rut: user.rut//user.rut
      },
    });
    return res.send({message:"send email"});
  } catch (e) {
    res.status(500).json({message: "Ha ocurrido un error, contacte con soporte"})
  }
}

module.exports = {
  login,
  recover_password
}
