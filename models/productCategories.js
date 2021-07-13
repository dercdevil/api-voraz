module.exports = (Sequelize,DataTypes) => {
  const ProductCategories = Sequelize.define('product_categories',{
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()')
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ')
    }
  })

  ProductCategories.associate = model => {
    ProductCategories.belongsTo(model.Categories,{
      foreignKey: "category_id",
      as: "categories_products"
    });
    ProductCategories.belongsTo(model.Product,{
      foreignKey: "product_id",
      as: "product",
      onDelete: 'CASCADE'
    });
  }
  return ProductCategories;
}
