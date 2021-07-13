'use strict';
const sequelizePaginate = require('sequelize-paginate')
module.exports = (Sequelize,DataTypes) => {
  const Coupons = Sequelize.define('Coupons',{
    profile_id: {
      type: DataTypes.INTEGER
    },
    discount: {
      type: DataTypes.INTEGER
    },
    name:{
      type:DataTypes.STRING,
      allowNull: false,
      unique:true,
    },
    is_used: {
      type: DataTypes.BOOLEAN, 
      allowNull: false,
      defaultValue: false,
    }
  })

  Coupons.associate = model => {
    Coupons.belongsTo(model.Profile,{
      foreignKey: "profile_id",
      as: "profile"
    })
    Coupons.hasMany(model.OrderCoupons,{
      foreignKey: "coupon_id",
      as: "order_Coupons",
      onDelete: 'CASCADE'

    })
  }
  sequelizePaginate.paginate(Coupons)
  return Coupons;
}