const bcrypt = require('bcrypt');
const constants = require("../utils/constants");

module.exports = (Sequelize,DataTypes) => {
  const User = Sequelize.define('users',{
    rut: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(constants.roles),
      allowNull: false,
    },
    status:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
  User.associate = model => {

    User.hasOne(model.Profile,{
      foreignKey: 'user_id',
      as: 'profile',
      onDelete: 'CASCADE'
    }),
    User.hasMany(model.UserAddress,{
      foreignKey: 'user_id',
      as: 'user_address',
      onDelete: 'CASCADE'
    }),
    User.hasMany(model.Channels,{
      foreignKey: 'user_id',
      as: 'channels',
      onDelete: 'CASCADE'
    }),
    User.hasMany(model.Carrier,{
      foreignKey: 'user_id',
      as: 'carriers',
      onDelete: 'CASCADE'
    })
  }

  return User;
}
