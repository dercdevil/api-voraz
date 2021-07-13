module.exports = (Sequelize,DataTypes) => {
  const Carrier = Sequelize.define('carriers',{ //transportistas
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    radio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    base_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    extra_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    extra_distance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  })

  Carrier.associate = models => {
    Carrier.hasMany(models.CarrierAddress,{
      foreignKey: 'carrier_id',
      as : 'carrier_addresses',
      onDelete: 'CASCADE'
    })
    Carrier.belongsTo(models.User,{
      foreignKey: 'user_id',
      as : 'user',
      onDelete: 'CASCADE'
    })
  }

  return Carrier;
}
