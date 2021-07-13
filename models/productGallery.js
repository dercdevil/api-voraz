module.exports = (Sequelize,DataTypes) => {
  const ProductGallery = Sequelize.define('product_gallery',{
    img_product: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  })


  return ProductGallery;
}
