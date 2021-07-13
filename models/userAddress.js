module.exports = (Sequelize,DataTypes) => {
  const UserAddress = Sequelize.define('user_addresses',{
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description : {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city : {
      type: DataTypes.STRING,
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
  UserAddress.associate = model => {
    UserAddress.belongsTo(model.User,{
      foreignKey: 'user_id',
      as : 'users'
    }),
    UserAddress.hasMany(model.Orders,{
      foreignKey: "user_address_id",
      as: "orders",
      onDelete: 'CASCADE'
    })
  }

  return UserAddress;
}
