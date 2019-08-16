export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userName: {
      type: Sequelize.STRING,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    password: {
      type: Sequelize.STRING
    },
    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    avatarUrl: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    bio: {
      type: Sequelize.STRING,
      allowNull: true
    },
    followingsCount: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    followersCount: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    identifiedBy: {
      type: Sequelize.ENUM('fullname', 'username'),
      allowNull: true
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true
    },
    occupation: {
      type: Sequelize.STRING,
      allowNull: true
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false
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
  down: queryInterface => queryInterface.dropTable('Users')
};
