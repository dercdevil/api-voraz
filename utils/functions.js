const jwt = require("jsonwebtoken");
const models = require('../models');
const webPush = require('../webPush');
const constants = require('./constants');
const { sendMail } = require('./email');


const paginate = async (model, currentPage = 1, pageLimit = 10,where,include,options = {}) => {
  try {
      const limit = parseInt(pageLimit, 10);
      const page = parseInt(currentPage, 10);

      // create an options object
      let newOptions = {
          offset: getOffset(page, pageLimit),
          limit: limit,
          where,
          include,
          ...options
      };   
      let rows = await model.findAll({where,include});
      let data = await model.findAll({...newOptions});
      
      return {
          previousPage: getPreviousPage(page),
          currentPage: page,
          nextPage: getNextPage(page, limit, rows.length),
          lastPage:Math.ceil(rows.length/limit),
          totalResult: rows.length,
          limit: limit,
          data
      }
  } catch (error) {
      console.log(error);
  }
}
const getOffset = (page, limit) => {
  return (page * limit) - limit;
 }
 

 const getNextPage = (page, limit, total) => {
     if ((total/limit) > page) {
         return page + 1;
     }
 
     return null
 }
 
 const getPreviousPage = (page) => {
     if (page <= 1) {
         return null
     }
     return page - 1;
 }
const objectToFormData = (item)=>{
    var form_data = new FormData();

    for ( var key in item ) {
        form_data.append(key, item[key]);
    }
    return form_data;
}

const sendMessage = async (user_id,name)=>{
    // Payload Notification
    try {
    const channels = await models.Channels.findAll({where:{user_id}});
    const message = name ? `Tienes un nuevo pedido de parte de ${name}` : `Tienes un nuevo pedido`;
    if(channels.length === 0) return null;
    const payload = JSON.stringify({
      title: "Ha recibido un pedido",
      message
    });
    Promise.all(channels.map( async (item)=>{
        let data = await webPush.sendNotification({
            endpoint:item.endpoint,
            expirationTime: item.expiration_time,
            keys:{
                p256dh:item.p256dh,
                auth:item.auth
            }
        }, payload);
        return null;
    })); 
    } catch (error) {
      console.log(error);
    }
};
const returnExpIn = async (req) => {
    let token = req.headers["x-access-token"];
    if(!token) return 0;
    const { exp }  = jwt.verify(token, constants.secretTokenKey);
    return exp;
  
};
const returnRole = async (req) => {
    let token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, constants.secretTokenKey);
    const user = await models.User.findOne({ where:{id: decoded.id}});
    return user.role;
};
const returnProfile = async (req) => {
    let token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, constants.secretTokenKey);
    const user = await models.User.findOne({
        where: {id : decoded.id},
        include: [{
          model : models.Profile,
          required: true,
          as: 'profile'
        }]
      });
    return user.dataValues.profile;
  
};
const calculateHours = ( init, final,inventory_id) =>{
    let data  = [];
    while (init < final) { 
        let hour = init.split(':')[0];
        if(data.length != 0){
            if(init.split(':')[1] < 15){
                data.push({hour :`${hour}:15`,inventory_id});
                init = `${hour}:15`;
            }
            if(init.split(':')[1] < 30){
                data.push({hour :`${hour}:30`,inventory_id});
                init = `${hour}:30`;
            }
            if(init.split(':')[1] < 45){
                data.push({hour :`${init.split(':')[0]}:45`,inventory_id});
                hour ++;
                if(hour < 10){
                    init = `0${ hour }:00`;
                }else{
                    init = `${ hour }:00`;
                }
                if(init != "24:00")
                data.push({hour:init,inventory_id});
            }
        } 
        if(data.length === 0 ){
            data.push({hour:init,inventory_id})
        }
    }
    return data;
}
const insertHours = async(init, final,inventory_id) => {
    await models.InventoriesHours.destroy({where:{inventory_id}});
    let  data = [];
    if (init > final){
        let data2;
        let data3;init,final,inventory_id
        data2 = calculateHours(init,"23:45",inventory_id);
        data3 = calculateHours("00:00",final,inventory_id);
        data= [...data2, ...data3];
    }else{
        data = calculateHours(init,final,inventory_id);
    }
    return await models.InventoriesHours.bulkCreate(data);
};
const stageTranslate = (stage) =>{
    if(stage == 'IN-PROGRESS'){
        return "EN PROGRESO";
    }
    if(stage == 'CREATED'){
        return "CREADA";
    }
    if(stage == 'IN-DELIVERY'){
        return "EN CAMINO";
    }
    if(stage == 'RECEIVED'){
        return "RECIBIDA";
    }
}
const sendEmailOrderStage = async (orderStage,order_id,profile_id,user_id) => {
    const stage = stageTranslate(orderStage);
    if(profile_id){
        const shop = await models.Profile.findOne({where: { id:profile_id}});
        await sendMail({
            to: shop.email,
            template: "order-notification",
            subject:"estado de la orden",
            content: {
                order_id,
                stage,
            },
        });
    }
    if(user_id){
        const client  = await models.User.findOne({
            include: [{
                model : models.Profile,
                required: true,
                as: 'profile'
            }],
            where:{id:user_id}
            });
        if(client){
            if( client.dataValues.profile.email){
                await sendMail({
                    to: client.dataValues.profile.email,
                    template: "order-notification",
                    subject:"estado de la orden",
                    content: {
                        order_id,
                        stage,
                    },
                });
            }
        }   
    }
}
module.exports = {
  paginate, 
  objectToFormData, 
  sendMessage, 
  returnExpIn,
  returnRole,
  returnProfile,
  insertHours, 
  stageTranslate, 
  sendEmailOrderStage
}