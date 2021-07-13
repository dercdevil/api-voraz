'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('profiles', 
    [
      {
      name: "admin",
      last_name:"admin",
      email:"dramirez@suavit.cl",
      user_id:1,
      address:"iquique",
      phone:"+569-84766696"
      },
    ], {});
   
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('profiles', null, {});
  }
};
