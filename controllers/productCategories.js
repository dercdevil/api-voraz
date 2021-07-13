const { validationResult } = require("express-validator");
const models = require('../models');

const create = async (req,res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).send({ errors: errors.array()})
    }
    const { product_id, categories } = req.body;
    await models.ProductCategories.destroy({where: { product_id }});
    const payload = categories.map((category_id)=>{
      return { product_id, category_id };
    });
    const productCategories = await models.ProductCategories.bulkCreate(payload);
    return res.status(200).send(productCategories); 
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  create,
}
