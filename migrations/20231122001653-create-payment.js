'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      payment_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      payment_reference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      user_id:{
        type: Sequelize.UUID,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
  }
};