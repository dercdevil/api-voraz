const app = require("./app");
const models = require('./models');

app.listen(app.get("port"));
models.sequelize.sync({force : false }).then(()=>{
    console.log("success database");
})
console.log("Server on port", app.get('port'));