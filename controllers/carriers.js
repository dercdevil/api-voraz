const { validationResult } = require("express-validator");

const models = require('../models');
const { returnUserByToken } = require("../middleware");

const get = async (req,res) => {
  try {
    const  user = await returnUserByToken(req);
    if(req.query.id){
      const carrier = await models.Carrier.findOne({
        where:{ user_id : user.id, id}, 
        include: ["carrier_addresses"]
      });
      return res.status(200).send(carrier);
    }
    const carriers = await models.Carrier.findAll({
      where:{ user_id : user.id }, 
      include: ["carrier_addresses"]
    });
    return res.status(200).send(carriers);
  } catch (error) {
    return res.status(500).send(error);
  }
}
const create = async (req,res) => {
  try {
    const errors = validationResult(req);
    const  user = await returnUserByToken(req);
    if(!errors.isEmpty()){
      return res.status(422).send({ errors: errors.array()})
    }
    const carrier = await models.Carrier.create({
      ...req.body,
      base_price: Math.round(req.body.base_price),
      extra_price: Math.round(req.body.extra_price),
      user_id:user.id
    });
    return res.status(200).send(carrier); 
  } catch (error) {
    return res.status(500).send(error);
  }
}

const update =  async (req,res) => {
  try {
    const { id } = req.params;
    const carrier = await models.Carrier.findOne({where:{ id }});
    if(!carrier) return res.status(404).send({ message:"bad id" });
    carrier.update({
        ...req.body
    })
    carrier.save()
    return res.status(200).send(carrier);
  } catch (error) {
    return res.status(500).send(error); 
  }
}

async function destroy(req,res){
  try {
    const { id } = req.params;
    await models.Carrier.destroy({where:{ id }});
    return res.status(200).send({ message:"success" }); 
  } catch (error) {
    return res.status(500).send(error); 
  }
}


module.exports = {
  get,
  create,
  update,
  destroy,
}
