export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserCategory', {
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    categoryId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('UserCategory')
};
