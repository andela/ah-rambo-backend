import SequelizeSlugify from 'sequelize-slugify';
import { Op } from 'sequelize';

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
        type: DataTypes.STRING(500),
        allowNull: true
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:
          'http://res.cloudinary.com/teamrambo50/image/upload/v1567524113/pgkcpg4prdi5p2fpiorq.png',
        validate: {
          isUrl: {
            msg: 'image must be a valid url path'
          }
        }
      },
      articleBody: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
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

  Article.getSearchVector = () => '_search';

  Article.search = async (query, limit, offset) => {
    query = sequelize.getQueryInterface().escape(query);

    const queryResult = await sequelize.query(
      `
      SELECT "Article".*, "comments"."comment" AS "comment",
      "comments->author"."firstName" AS "firstName", 
      "comments->author"."lastName" AS "lastName", 
      "comments->author"."userName" AS "userName", 
      "comments->author"."avatarUrl" AS "avatarUrl"
      FROM (SELECT "Article"."id", "Article"."slug", "Article"."title", 
      "Article"."description", "Article"."image", "Article"."articleBody", 
      "Article"."likesCount", "Article"."dislikesCount", 
      "Article"."publishedAt" FROM "Articles" AS "Article" WHERE 
      "${Article.getSearchVector()}" @@ plainto_tsquery('english', ${query})
      AND "Article"."isArchived" = false AND "Article"."publishedAt" IS NOT NULL
      LIMIT ${limit} OFFSET ${offset}) 
      AS "Article" LEFT OUTER JOIN "Comments" AS "comments" 
      ON "Article"."id" = "comments"."articleId" LEFT OUTER JOIN
      "Users" AS "comments->author" 
      ON "comments"."userId" = "comments->author"."id"
      `
    );

    if (!queryResult[0].length) return { count: 0, results: [] };

    const formattedResponse = queryResult[0].map((item, index, array) => {
      const comments = [];

      if (item.comment) {
        comments.push({
          comment: item.comment,
          author: {
            firstName: item.firstName,
            lastName: item.lastName,
            userName: item.userName,
            avatarUrl: item.avatarUrl
          }
        });
      }

      ['comment', 'firstName', 'lastName', 'userName', 'avatarUrl'].forEach(
        prop => delete item[prop]
      );

      item.comments = comments;
      return array;
    });

    const items = formattedResponse[0];

    const results = items.reduce((acc, value) => {
      const key = value.id;
      if (acc[key]) {
        acc[key] = {
          ...acc[key],
          comments: [...acc[key].comments, { ...value.comments[0] }]
        };
      } else {
        acc[key] = { ...value };
      }
      return acc;
    }, {});

    return { count: queryResult[1].rowCount, results: [results] };
  };

  Article.findByPage = async (offset, limit, models) => {
    const { count, rows } = await Article.findAndCountAll({
      distinct: true,
      where: {
        isArchived: false,
        publishedAt: {
          [Op.ne]: null
        }
      },
      attributes: [
        'slug',
        'title',
        'description',
        'image',
        'articleBody',
        'likesCount',
        'dislikesCount',
        'publishedAt'
      ],
      limit,
      offset,
      include: [
        {
          model: models.Comment,
          as: 'comments',
          attributes: ['comment'],
          include: [
            {
              model: models.User,
              as: 'author',
              attributes: [
                'firstName',
                'lastName',
                'userName',
                'avatarUrl',
                'bio'
              ]
            }
          ]
        },
        {
          model: models.Tag,
          as: 'tags',
          attributes: ['name'],
          through: { attributes: [] }
        }
      ]
    });
    return { count, results: rows };
  };

  Article.findById = async (id) => {
    const article = await Article.findOne({ where: { id } });
    return article;
  };

  Article.findBySlug = async (slug) => {
    const article = await Article.findOne({ where: { slug } });
    if (article) return article;
    return null;
  };

  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'Author',
      onDelete: 'CASCADE'
    });
    Article.belongsToMany(models.Tag, {
      foreignKey: 'articleId',
      otherKey: 'tagId',
      through: 'ArticleTags',
      as: 'tags',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    Article.hasMany(models.Comment, {
      foreignKey: 'articleId',
      as: 'comments'
    });

    Article.hasMany(models.Like, {
      foreignKey: 'contentId',
      as: 'likes',
      scope: {
        contentType: 'article'
      }
    });
    Article.hasMany(models.Dislike, {
      foreignKey: 'contentId',
      as: 'dislikes',
      scope: {
        contentType: 'article'
      }
    });
    Article.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };

  SequelizeSlugify.slugifyModel(Article, {
    source: ['title'],
    overwrite: false,
    replacement: '-'
  });

  return Article;
};
