'use strict';
module.exports = (Sequelize,DataTypes) => {
  const InventoriesHours = Sequelize.define('inventories_hours',{
    inventory_id: DataTypes.INTEGER,
    hour: DataTypes.TIME,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()')
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()')
    }
  })

  InventoriesHours.associate = model => {
    InventoriesHours.belongsTo(model.Inventories,{
      foreignKey: "inventory_id",
      as: "inventory"
    })
  }
  return InventoriesHours;
}