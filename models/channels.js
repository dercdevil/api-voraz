module.exports = (Sequelize,DataTypes) => {
  const Channels = Sequelize.define('channels',{
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    endpoint:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiration_time:{
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },    
    p256dh:{
      type: DataTypes.STRING,
       allowNull: false,

    },
    auth:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()')
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()')
    }
  });
  return Channels;
}
