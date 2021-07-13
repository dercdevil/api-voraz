'use strict';
module.exports = (Sequelize,DataTypes) => {
  const OrderCoupons = Sequelize.define('order_coupons',{
    order_id: DataTypes.INTEGER,
    coupon_id: DataTypes.INTEGER
  })

  OrderCoupons.associate = model => {
    OrderCoupons.belongsTo(model.Orders,{
      foreignKey: "order_id",
      as: "orders"
    })
    OrderCoupons.belongsTo(model.Coupons,{
      foreignKey: "coupon_id",
      as: "coupons"
    })
  }
  return OrderCoupons;
}