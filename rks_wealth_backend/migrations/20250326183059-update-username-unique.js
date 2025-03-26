'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "username", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true, // Ensure unique constraint
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "username", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false, // Rollback: Remove unique constraint if needed
    });
  }
};
