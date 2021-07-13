'use strict';
const constants = require("../utils/constants");
const sequelizePaginate = require('sequelize-paginate')

module.exports = (Sequelize,DataTypes) => {
  const Inventories = Sequelize.define('inventories',{
    product_id: DataTypes.INTEGER,
    profile_id :DataTypes.INTEGER,
    day:{
      type: DataTypes.ENUM(constants.days), 
      allowNull: false,
    },
    stock:{
      type: DataTypes.INTEGER,
    },
    is_repeat:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()')
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()')
    }
  })

  Inventories.associate = model => {
    Inventories.belongsTo(model.Product,{
      foreignKey: "product_id",
      as: "product"
    });
    Inventories.belongsTo(model.Profile,{
      foreignKey: "profile_id",
      as: "profile"
    }),
    Inventories.hasMany(model.InventoriesHours,{
      foreignKey: "inventory_id",
      as: "inventoriesHours",
      onDelete: 'CASCADE'
    })
  }
  sequelizePaginate.paginate(Inventories)

  return Inventories;
}