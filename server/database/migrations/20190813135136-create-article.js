export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Articles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    description: {
      type: Sequelize.STRING(500)
    },
    slug: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    articleBody: {
      type: Sequelize.TEXT
    },
    authorId: {
      type: Sequelize.INTEGER
    },
    likesCount: {
      type: Sequelize.INTEGER
    },
    dislikesCount: {
      type: Sequelize.INTEGER
    },
    publishedAt: {
      type: Sequelize.DATE
    },
    isArchived: {
      type: Sequelize.BOOLEAN
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
  down: queryInterface => queryInterface.dropTable('Articles')
};
