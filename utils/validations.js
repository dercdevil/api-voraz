const models = require('../models');

const insertHours = async(init,final) => {
    const initArray = init.split(':');
    const finalArray = final.split(':'); 
    if(initArray.length  < 2 || finalArray.length < 2){
       return { message: "formato de hora invalido"}
    }
 };
 
module.exports = {
  insertHours,
}