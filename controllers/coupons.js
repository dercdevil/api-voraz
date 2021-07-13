const { validationResult } = require("express-validator");
const models = require('../models');
const { returnUserByToken } = require("../middleware");

const get = async (req,res) => {
  try {
    const { page, id, is_used} = req.query;
    let whereCoupons = {}
    const user = await returnUserByToken(req);
    const profile = await models.Profile.findOne({where: {user_id: user.id}});
    if(!profile) return res.status(403).send({message:"profile not create"});
    if(id) 
        whereCoupons = {...whereCoupons, id }
    if(is_used)
      whereCoupons = {...whereCoupons, is_used }
    const coupons = await models.Coupons.paginate({
        where : { ...whereCoupons },
        page : page || 1
    });
    return res.status(200).send(coupons);
  } catch (error) {
    return res.status(500).send(error); 
  }
}
const isCouponValid = async (req,res) =>{
  try {
    const { name } = req.params;
    const coupon = await models.Coupons.findOne({ where: {  name }});
    if(!coupon)return res.status(404).send({message:"not found"});
    if(coupon.is_used) return res.status(200).send({is_used:coupon.is_used});
    delete coupon.dataValues.id;
    delete coupon.dataValues.profile_id;
    return res.send(coupon);    
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function create(req,res){
  try {
    const errors = validationResult(req);
    const  user = await returnUserByToken(req);
    if(!errors.isEmpty()){
      return res.status(422).send({ errors: errors.array()})
    }
    const profile = await models.Profile.findOne({where: {user_id: user.id }});
    if(!profile) return res.status(403).send({message:"profile not create"});
    req.body.discount= req.body.discount;
    req.body.profile_id = profile.id;
    const coupon = await models.Coupons.create({
     ...req.body
    });
    return res.status(200).send(coupon);
  } catch (error) {
    return res.status(500).send(error);    
  }  
}

async function createByAdmin(req,res){
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).send({ errors: errors.array()})
    }
    const profile = await models.Profile.findOne({where: {user_id: req.params.user_id}});
    if(!profile) return res.status(403).send({message:"profile not create"});
    const coupon = await models.Coupons.create({
      name: req.body.name,
      discount:req.body.discount,
      profile_id: profile.id, 
      is_used:false,
    });
    return res.status(200).send(coupon);  
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function update(req,res){
  try {
    let coupon = await models.Coupons.findOne({ where: { id: req.params.id } });
    if(!coupon) return res.status(400).send({message:"bad request"});
    coupon.update({ ...req.body });
    coupon.save();
    return res.send(coupon);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function destroy(req,res){
  try {
    await models.Coupons.destroy({ where: { id: req.params.id } });
    return res.send({message:"success"});
  } catch (error) {
   return res.status(500).send({message: "oh no, bad request"}); 
  }
}

module.exports = {
  get,
  create,
  createByAdmin,
  update,
  destroy,
  isCouponValid
}