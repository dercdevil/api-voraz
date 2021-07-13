'use strict';
const sequelizePaginate = require('sequelize-paginate');
const constants = require("../utils/constants");

module.exports = (Sequelize,DataTypes) => {
  const Orders = Sequelize.define('orders',{
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(constants.orderStatus), 
      defaultValue: "IN-PROGRESS",
      allowNull: false,
    },
    stage:{
      type: DataTypes.ENUM(constants.orderStage),
      defaultValue: "IN-PROGRESS",
      allowNull: false,
    },
    delivery_date:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    total:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_neto:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    flow_order: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    method: {
      type: DataTypes.ENUM("FLOW","CASH"),
      allowNull: false,
    },
    carrier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_address_id :{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  })
  Orders.associate = model => {
    Orders.belongsTo(model.User,{
      foreignKey: "user_id",
      as: "user",
      onDelete: 'CASCADE'
    }),
    Orders.belongsTo(model.Profile,{
      foreignKey: "profile_id",
      as: "profile",
      onDelete: 'CASCADE'
    }),
    Orders.hasMany(model.OrderProducts,{
      foreignKey: "order_id",
      as: "orderProducts",
      onDelete: 'CASCADE'
    }),
    Orders.hasMany(model.OrderCoupons,{
      foreignKey: "order_id",
      as: "orderCoupons",
      onDelete: 'CASCADE'
    }),
    Orders.belongsTo(model.UserAddress,{
      foreignKey: "user_address_id",
      as: "userAddress",
      onDelete: 'CASCADE'
    }),
    Orders.belongsTo(model.Carrier,{
      foreignKey: "carrier_id",
      as: "carrier",
      onDelete: 'CASCADE'
    })
  }
  sequelizePaginate.paginate(Orders)
  return Orders;
}