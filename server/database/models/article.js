import SequelizeSlugify from 'sequelize-slugify';

export default (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      slug: {
        type: DataTypes.STRING,
        unique: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [2, 250],
            msg: 'title must be strings between 2 and 250 chars long'
          }
        }
      },
      description: {
        type: DataTypes.STRING(1234),
        allowNull: true
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: {
            msg: 'image must be a valid url path'
          }
        }
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      likesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: 'likes count must be integers'
          },
          min: {
            args: [0],
            msg: 'articles likes count must not be less than 0'
          }
        }
      },
      dislikesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: 'dislike count must be integers'
          },
          min: {
            args: [0],
            msg: 'articles dislike count must not be less than 0'
          }
        }
      },
      publishedAt: {
        type: DataTypes.DATE,
        default: null
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  );
  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'Author',
      onDelete: 'CASCADE'
    });
  };
  SequelizeSlugify.slugifyModel(Article, {
    source: ['title'],
    replacement: '-'
  });
  return Article;
};
