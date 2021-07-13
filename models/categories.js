const sequelizePaginate = require('sequelize-paginate')

module.exports = (Sequelize,DataTypes) => {
  const Categories = Sequelize.define('categories',{
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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

  Categories.associate = model => {
    Categories.hasMany(model.ProductCategories,{
      foreignKey: "category_id",
      as: "categories_products",
      onDelete: 'CASCADE'
    })
  }
  sequelizePaginate.paginate(Categories)

  return Categories;
}
