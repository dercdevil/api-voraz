const models = require('../models');

const getMonday = (init)=>{
    const d = init ? new Date(init) : new Date(); 
    var day = d.getDay(); 
    var diff = d.getDate() - day + (day == 0 ? -6:1);   
    const date  =new Date(d.setDate(diff));
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

const addDays = function(d, date)
{
 var newDate = new Date();
 var setDate = date || (newDate.getDate() + "/" + (newDate.getMonth() +1) + "/" + newDate.getFullYear());
 var sep = setDate.indexOf('/') != -1 ? '/' : '-';
 var afterDate = setDate.split(sep);
 var date = afterDate[2]+'/'+afterDate[1]+'/'+afterDate[0];
 date= new Date(date);
 date.setDate(date.getDate()+parseInt(d));
 var year=date.getFullYear();
 var month= date.getMonth()+1;
 var day= date.getDate();
 month = (month < 10) ? ("0" + month) : month;
 day = (day < 10) ? ("0" + day) : day;
 var fechaFinal = year+sep+month+sep+day;
 return (fechaFinal);
 }

const sellInDay = async (req,res) =>{
    try {
        let day = getMonday(req.query.initDate);
        if(req.params.day.toUpperCase() === "MARTES")
            day = addDays(1,day);
        if(req.params.day.toUpperCase() === "MIERCOLES")
            day = addDays(2,day);
        if(req.params.day.toUpperCase() === "JUEVES")
            day = addDays(3,day);
        if(req.params.day.toUpperCase() === "VIERNES")
            day = addDays(4,day);
        if(req.params.day.toUpperCase() === "SABADO")
            day = addDays(5,day);
        if(req.params.day.toUpperCase() === "DOMINGO")
            day = addDays(6,day);
        let finalDate = addDays(1,day);
    
        const totalSell = await models.OrderProducts.findAll({
            where: { product_id : req.params.product_id,
               createdAt : { $between: [day, finalDate] }
            },
        })
        return res.status(200).send({totalSell});   
    } catch (error) {
        return res.status(500).send(error);      
    }
}
module.exports = {
    sellInDay,
  }
  