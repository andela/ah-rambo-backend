export default (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Tag',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          len: {
            args: [2],
            msg: 'tag name should be greater than one character'
          }
        }
      }
    },
    {}
  );

  Tag.getSearchVector = () => '_search';

  Tag.search = async (query, limit, offset) => {
    query = sequelize.getQueryInterface().escape(query);

    const queryResult = await sequelize.query(
      `
      SELECT "Tag".*, "articles"."articleBody"
       AS "articleBody", "articles"."title" AS "title", 
       "articles"."description" AS "description", "articles"."slug" 
       AS "slug", "articles"."image" AS "image", 
       "articles"."likesCount" AS "likesCount", "articles"."dislikesCount" 
       AS "dislikesCount", "articles"."publishedAt" AS "publishedAt", 
       "articles->Author"."firstName" AS "firstName", 
       "articles->Author"."lastName" AS "lastName", 
       "articles->Author"."userName" AS "userName",
       "articles->Author"."bio" AS "bio"
       FROM (SELECT "Tag"."id", "Tag"."name" FROM "Tags" AS "Tag" WHERE 
       "${Tag.getSearchVector()}" @@ plainto_tsquery('english', ${query}) 
       LIMIT ${limit} OFFSET ${offset}) AS "Tag" LEFT OUTER JOIN 
       ( "ArticleTags" AS "articles->ArticleTags" 
       INNER JOIN "Articles" AS "articles" ON 
       "articles"."id" = "articles->ArticleTags"."articleId") ON 
       "Tag"."id" = "articles->ArticleTags"."tagId" LEFT OUTER JOIN "Users" 
       AS "articles->Author" ON "articles"."authorId" = "articles->Author"."id";
      `
    );

    if (!queryResult[0].length) return { count: 0, results: [] };

    const formattedResponse = queryResult[0].map((item, index, array) => {
      const articles = [];

      if (item.articleBody) {
        articles.push({
          articleBody: item.articleBody,
          title: item.title,
          description: item.description,
          slug: item.slug,
          image: item.image,
          likesCount: item.likesCount,
          dislikesCount: item.dislikesCount,
          publishedAt: item.publishedAt,
          author: {
            firstName: item.firstName,
            lastName: item.lastName,
            userName: item.userName,
            avatarUrl: item.avatarUrl,
            bio: item.bio
          }
        });
      }

      [
        'articleBody',
        'title',
        'description',
        'slug',
        'image',
        'likesCount',
        'dislikesCount',
        'publishedAt',
        'firstName',
        'lastName',
        'userName',
        'avatarUrl',
        'bio'
      ].forEach(prop => delete item[prop]);

      item.articles = articles;
      return array;
    });

    const items = formattedResponse[0];

    const results = items.reduce((acc, value) => {
      const key = value.id;
      if (acc[key]) {
        acc[key] = {
          ...acc[key],
          articles: [...acc[key].articles, { ...value.articles[0] }]
        };
      } else {
        acc[key] = { ...value };
      }
      return acc;
    }, {});

    return { count: queryResult[1].rowCount, results: [results] };
  };

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Article, {
      foreignKey: 'tagId',
      otherKey: 'articleId',
      through: 'ArticleTags',
      as: 'articles',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return Tag;
};
