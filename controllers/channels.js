const models = require('../models');
const { returnUserByToken } = require("../middleware");

const subscription = async (req, res) => {
  try {
    const  user = await returnUserByToken(req);
    const { endpoint, expirationTime, keys } = req.body;
    if(!(await models.Channels.findOne({where:{ endpoint}}))){
        await models.Channels.create({
            user_id:user.id,
            endpoint,
            expiration_time:expirationTime,
            p256dh: keys.p256dh,
            auth: keys.auth
        });
    }
    return res.status(201).json();    
  } catch (error) {
    return res.status(500).send(error);
  }
};
  
  
  module.exports = {
    subscription,
  }