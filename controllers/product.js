const { validationResult } = require("express-validator");
const models = require('../models');
const { returnUserByToken } = require("../middleware");
const { paginate } = require("../utils/functions");

const get = async (req,res) => {
  try {
    const {
      not_paginate, status, stores, 
      category_id , word, get_categories,days,time_final,time_init,
      page, id,is_premium,profile_id,
      size,maxPrice = 1000000,minPrice = 0 } = req.query;
    let whereProducts = {
      status: status || 1,
    };
    let categories = null ; 
    let include = ['gallery','profile' ];
    const order =[['id', 'DESC']];
    if(maxPrice || minPrice ){
      whereProducts = {
        ...whereProducts,
        price: {
          [models.Op.between]: [+minPrice, +maxPrice] 
        }
      }
    }
    if(id)whereProducts = { ...whereProducts, id };
    if(profile_id) whereProducts = { ...whereProducts, profile_id };
    if(stores) {
      whereProducts = { ...whereProducts, profile_id: { [models.Op.in] : stores.split(',') } };
    }
    if(is_premium) whereProducts = { ...whereProducts,is_premium: is_premium == 'true'? true : false };
    if(word) whereProducts = {
      ...whereProducts,
      [models.Op.or] : [
        {name : {[models.Op.substring] : word} }, {description : {[models.Op.substring] : word} }
      ],
    }
    if(get_categories){
      let whereCategory = {};
      if(category_id) whereCategory = { ...whereCategory, category_id };
      categories = {
        model: models.ProductCategories,
        as: 'product_categories',
        where: { ...whereCategory },
        include : ['categories_products']
      }
      include.push(categories);
    }
    let products;
    let whereInventories = {};
    let whereInventoriesHours = {};
    if(days){
      whereInventories = {...whereInventories,day:{ [models.Op.in]: days.split(',') } };
    } 
    if(time_final && time_init) {
      if(time_final > time_init) {
        whereInventoriesHours = { ...whereInventoriesHours,hour : { [models.Op.between] : [time_init,time_final] } };
      }else{
        whereInventoriesHours ={ ...whereInventoriesHours,
          [models.Op.or]: [
            { hour : {  [models.Op.between] : [time_init,'23:59']} },
            { hour : {  [models.Op.between] : ['00:00',time_final]} },
          ]
        }
      }
    }
    include.push({
      model: models.Inventories,
      as: 'inventories',
      where: { ...whereInventories },
      include:[
        {
          model: models.InventoriesHours,
          as: 'inventoriesHours',
          where: { ... whereInventoriesHours}
        }
      ],
    });
    if(!!not_paginate){
      products = await models.Product.findAll({
      where : { ...whereProducts },
      include,
      order
    });
    }else{
      products = await paginate(models.Product,page,size,whereProducts,include,{order});
    }
    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).send(error);
  }
}


const getOne = async (req,res) => {
  products = await models.Product.findOne({where: {id: req.params.id}});
  if(!products) return res.status(404).send({message:"id not exists"});
  return res.status(200).send(products);
}

async function create(req,res){
  try {
    const errors = validationResult(req);
    const user = await returnUserByToken(req);
    if(!errors.isEmpty()){
      return res.status(422).send({ errors: errors.array()})
    }
    const profile = await models.Profile.findOne({ where: {user_id: user.id} });
    if(!profile)  return res.status(404).send({message:"profile not exist "});
    const product = await models.Product.create({
      ...req.body,
      price: Math.round(req.body.price),
      profile_id: profile.id
    });
    return res.status(200).send(product);   
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function update(req,res){
  try {
    const user = await returnUserByToken(req);
    const profile = await models.Profile.findOne({where:{user_id: user.id}});
    let product = await models.Product.findOne({ where: { profile_id: profile.id, id: req.params.id } });
    if(!product) return res.status(400).send({message:"bad request"});
    if(req.body.price){
      req.body.price = Math.round(req.body.price);
    }
    product.update({ ...req.body });
    product.save();
    return res.send(product);
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function destroy(req,res){
  try {
    const user = await returnUserByToken(req);
    const profile = await models.Profile.findOne({where: {user_id: user.id} });
    if(!profile) return res.status(400).send({message:"bad request"});
    await models.Product.destroy({ where: {profile_id:profile.id, id: req.params.id } });
    return res.send({message:"success"});
  } catch (error) {
   return res.status(500).send({ message:"oh no, bad request"}); 
  }
}

async function updateByAdmin(req,res){
  try {
    let product = await models.Product.findOne({ where: { id: req.params.id } });
    if(!product) return res.status(400).send({message:"bad request"});
    product.update({ ...req.body });
    product.save();
    return res.send(product); 
  } catch (error) {
    return res.status(500).send(error);
  }
}

async function destroyByAdmin(req,res){
  try {
    await models.Product.destroy({ where: { id: req.params.id } });
    return res.send({message:"success"});
  } catch (error) {
   return res.status(500).send({ message:"oh no, bad request"}); 
  }
}

module.exports = {
  get,
  getOne,
  create,
  update,
  destroy,
  updateByAdmin,
  destroyByAdmin
}