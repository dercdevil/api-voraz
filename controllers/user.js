const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");

const models = require('../models');
const { returnUserByToken } = require("../middleware");
const constants = require("../utils/constants");
const { returnExpIn } = require("../utils/functions");



const attributes = [
  'rut','role','id','status'
]

const get = async (req,res) => {
  try {
    const payload = await returnUserByToken(req);
    const user = await models.User.findOne({where: { id: payload.id }, include: ['profile','user_address'], attributes});
    const expIn = await returnExpIn(req);
    return res.send({...user.dataValues,expIn }); 
  } catch (error) {
    return res.status(500).send(error);
  }
}

const getAll = async (req,res) => {
  try {
    let where = {}; 
    const { rut, role} = req.query;
    if(rut) where = { ...where, rut };
    if(role) where = { ...where, role };
    const user = await models.User.findAll({where,include: ['profile','user_address'], attributes});
    return res.send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
}

const getSeller = async (req,res) => {
  try {
    
    let where = {
      role :"VENDEDOR"
    }; 
    const user = await models.User.findAll({where,include: [{
      model: models.Profile,
      where: {
        user_id: {
          [models.Op.ne]: null
        }
      },
      as: 'profile',
      include : [{
        model: models.Product,
        as: 'products',
        include: "gallery"
      }]
    },{
      model: models.Carrier,
      as: 'carriers',
      include : [{
        model: models.CarrierAddress,
        as: 'carrier_addresses',
      }]
    },"user_address",], attributes});
    return res.send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
}

const create = async (req,res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).send({ errors: errors.array()})
    }
    req.body.password = bcrypt.hashSync(req.body.password,10);
    if(constants.roles.indexOf(req.body.role) === -1){
      return res.status(404).send({message:"role not exist"});
    }
    let user = {};
    if(await models.User.findOne({where:{ rut: req.body.rut }})){
      return res.status(403).json({message: 'rut exist' })
    }
    if(constants.roles.indexOf(req.body.role) === 0){
       user = await returnUserByToken(req);
      if(user.role !== "ADMINISTRADOR") return res.status(403).json({message: 'Forbidden' })
    }
    user = await models.User.create({
        ...req.body
    });
    return res.send(user); 
  } catch (error) {
    return res.status(500).send(error);
  }
}

const update =  async (req,res) => {
  try {
    let  user = await returnUserByToken(req);
    if(req.body.password){
      req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    }
  
    if(req.body.role){
      if(user.role !== "ADMINISTRADOR") return res.status(403).json({message: 'Forbidden, the rol not update' })
    }
    user.update({...req.body });
    user.save();
    return res.status(200).send({message:"success"}); 
  } catch (error) {
    return res.status(500).send(error);
  }
}

const updateByAdmin =  async (req,res) => {
  try {
    if(req.body.password){
      req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    }
    await models.User.update({...req.body},{where: {id : req.params.id}})
    return res.status(200).send({message:"success"}); 
  } catch (error) {
    return res.status(500).send(error);
  }
}
async function destroy(req,res){
  const payload = await returnUserByToken(req);
  const t = await models.sequelize.transaction();
  try {
    await models.UserAddress.destroy({where: {user_id:payload.id}, transaction: t})
    await models.Profile.destroy({where: {user_id:payload.id}, transaction: t})
    await models.User.destroy({where: {id: payload.id}, transaction: t})
    await t.commit()
    res.json({message: "success"})
  } catch (e) {
    await t.rollback()
    res.status(500).json({message : "error"})
  }
}
async function destroyByAdmin(req,res){
  try {
    const t = await models.sequelize.transaction()
    try {
      if(!req.body.id) return res.status(404).send({message: "user not exist "});
      await models.User.destroy({where: {id: req.body.id}, transaction: t})
      await t.commit()
      res.json({message: "success"})
    } catch (e) {
      await t.rollback()
      res.status(500).json({message : "error"})
    } 
  } catch (error) {
    return res.status(500).send(error)
  }
}

module.exports = {
  get,
  getAll,
  create,
  update,
  updateByAdmin,
  destroy,
  getSeller,
  destroyByAdmin
}
