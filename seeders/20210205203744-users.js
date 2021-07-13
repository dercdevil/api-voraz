'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        rut: "123456-1",
        password:  bcrypt.hashSync("123456",10),
        role: "ADMINISTRADOR",
      }
    ], 
    {
    });
  
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};