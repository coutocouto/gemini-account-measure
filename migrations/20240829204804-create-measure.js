"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("measures", {
      measure_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      image_uri: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customer_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      measure_value: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      has_confirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      measure_type: {
        type: Sequelize.ENUM("WATER", "GAS"),
        allowNull: false,
      },
      measure_date_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("measures");
  },
};
