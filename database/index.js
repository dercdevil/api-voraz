const config = require("../config/config.json");
require('dotenv').config();

const Sequelize = require("sequelize");
let dbConfig = config.development;
if (process.env.NODE_ENV === "production"){
  dbConfig = config.production;
}

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port:dbConfig.port
});



module.exports = sequelize;