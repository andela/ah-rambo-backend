export default (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: {
            args: [2, 5000],
            msg: 'comment must be text between 2 and 5000 chars long'
          }
        }
      },

      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'articleId must be an integer'
          }
        }
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'userId must be an integer'
          }
        }
      }
    },
    {}
  );
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE'
    });

    Comment.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'article',
      onDelete: 'CASCADE'
    });
  };
  return Comment;
};
