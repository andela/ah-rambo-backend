export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Sessions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    active: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    devicePlatform: {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: 'browser'
    },
    expiresAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    ipAddress: {
      type: Sequelize.STRING
    },
    token: {
      allowNull: false,
      type: Sequelize.STRING
    },
    userAgent: {
      type: Sequelize.STRING
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
  down: queryInterface => queryInterface.dropTable('Sessions')
};
