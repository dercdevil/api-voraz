const { validationResult } = require("express-validator");
const models = require('../models');
const { returnUserByToken } = require("../middleware");

const get = async (req,res) => {
  try {
    const  user = await returnUserByToken(req);
    const addresses = await models.UserAddress.findAll({where:{ user_id : user.id}});
    return res.status(200).send(addresses);
  } catch (error) {
    return res.status(500).send(error)
  }
}
const create = async (req,res) => {
  try {
    const errors = validationResult(req);
    const  user = await returnUserByToken(req);
    if(!errors.isEmpty()){
      return res.status(422).send({ errors: errors.array()})
    }
    const profile = await models.Profile.findOne({where:{user_id:user.id}});
    if(!profile) return res.status(400).send("profile not exist");
    const address = await models.UserAddress.create({
      ...req.body,
      user_id:user.id
    })
    return res.status(200).send(address); 
  } catch (error) {
    return res.status(500).send(error)
  }
}

const update =  async (req,res) => {
  try {
    const { id } = req.params;
    const address = await models.UserAddress.findOne({where:{ id }});
    if(!address) return res.status(404).send({ message:"bad id" });
    address.update({
        ...req.body
    })
    address.save()
    return res.status(200).send(address);
  } catch (error) {
    return res.status(500).send(error)
  }
}

async function destroy(req,res){
  try {
    const { id } = req.params;
    await models.UserAddress.delete({where:{ id }});
    return res.status(200).send({ message:"success" });  
  } catch (error) {
   return res.status(500).send(error) 
  }
}

module.exports = {
  get,
  create,
  update,
  destroy,
}
