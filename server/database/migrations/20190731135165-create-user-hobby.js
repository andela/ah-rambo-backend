export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserHobby', {
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    hobbyId: {
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
  down: queryInterface => queryInterface.dropTable('UserHobby')
};
