module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'userType', {
      type: Sequelize.ENUM('Admin', 'RM', 'SERVICE_RM'),
      allowNull: false,
      defaultValue: 'Admin',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'userType', {
      type: Sequelize.ENUM('Admin', 'RM', 'SRM'),
      allowNull: false,
      defaultValue: 'Admin',
    });
  },
};
