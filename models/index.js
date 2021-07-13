const Sequelize = require('sequelize');

const sequelize = require('../database');

let models = {
  Carrier  : require('./carriers')(sequelize, Sequelize),
  CarrierAddress  : require('./carrierAddresses')(sequelize, Sequelize),
  Categories  : require('./categories')(sequelize, Sequelize),
  Product  : require('./product')(sequelize, Sequelize),
  ProductCategories  : require('./productCategories')(sequelize, Sequelize),
  ProductGallery  : require('./productGallery')(sequelize, Sequelize),
  Profile  : require('./profile')(sequelize, Sequelize),
  User : require('./user')(sequelize, Sequelize),
  UserAddress : require('./userAddress')(sequelize, Sequelize),
  Inventories: require("./inventories")(sequelize, Sequelize),
  Coupons: require("./coupons")(sequelize, Sequelize),
  InventoriesHours: require("./inventoriesHours")(sequelize, Sequelize),
  OrderCoupons: require("./orderCoupons")(sequelize, Sequelize),
  OrderProducts: require("./orderProducts")(sequelize, Sequelize),
  Orders: require("./orders")(sequelize, Sequelize),
  Channels: require("./channels")(sequelize, Sequelize)
};

Object.keys(models).forEach((modelName) => {
  if('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;

models.Op = Sequelize.Op
module.exports = models;
