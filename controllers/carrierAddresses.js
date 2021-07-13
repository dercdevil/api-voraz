const { validationResult } = require("express-validator");

const models = require('../models');


const create = async (req,res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).send({ errors: errors.array()})
    }
    if(!await models.Carrier.findOne({where:{id: req.body.carrier_id}})){
      return res.status(404).send({ message:"bad carrier_id" });
    }
    const carrierAddresses = await models.CarrierAddress.create({
      ...req.body,
    });
    return res.status(200).send(carrierAddresses);
  } catch (error) {
    return res.status(500).send(error);
  }
}

const update =  async (req,res) => {
  try {
    const { id } = req.params;
    const carrierAddress = await models.CarrierAddress.findOne({where:{ id }});
    if(!carrierAddress) return res.status(404).send({ message:"bad id" });
    carrierAddress.update({
        ...req.body
    })
    carrier.save();
    return res.status(200).send(carrierAddress);
  } catch (error) {
    return res.status(500).send(error);
  }

}

async function destroy(req,res){
  try {
    const { id } = req.params;
    await models.CarrierAddress.destroy({where:{ id }});
    return res.status(200).send({ message:"success" });
  } catch (error) {
    return res.status(500).send(error);
  }
}


module.exports = {
  create,
  update,
  destroy,
}
