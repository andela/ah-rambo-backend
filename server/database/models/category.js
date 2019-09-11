export default (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING(100),
        defaultValue: ''
      }
    },
    {}
  );

  Category.getSearchVector = () => '_search';

  Category.search = async (query, limit, offset) => {
    query = sequelize.getQueryInterface().escape(query);

    const queryResult = await sequelize.query(
      `
      SELECT "Category".*, "Articles"."slug" 
      AS "slug", "Articles"."title" AS "title", 
      "Articles"."description" AS "description", "Articles"."image" 
      AS "image", "Articles"."articleBody" AS "articleBody", 
      "Articles"."likesCount" AS "likesCount", "Articles"."dislikesCount" 
      AS "dislikesCount", "Articles"."publishedAt" AS "publishedAt", 
      "Articles->Author"."firstName" AS "firstName", 
      "Articles->Author"."lastName" AS "lastName", 
      "Articles->Author"."userName" AS "userName",
      "Articles->Author"."bio" AS "bio"
      FROM (SELECT "Category"."id", 
      "Category"."name" FROM "Categories" AS "Category" WHERE 
      "${Category.getSearchVector()}" @@ plainto_tsquery('english', ${query}) 
      LIMIT ${limit} OFFSET ${offset}) 
      AS "Category" LEFT OUTER JOIN "Articles" AS "Articles" 
      ON "Category"."id" = "Articles"."categoryId" LEFT OUTER JOIN "Users" 
      AS "Articles->Author" ON "Articles"."authorId" = "Articles->Author"."id"
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

  Category.findByName = async (name) => {
    const nameClone = name.toLowerCase();
    const category = await Category.findOne({ where: { name: nameClone } });
    return category;
  };

  Category.associate = (models) => {
    Category.belongsToMany(models.User, {
      foreignKey: 'categoryId',
      otherKey: 'userId',
      through: 'UserCategory',
      as: 'users'
    });
    Category.hasMany(models.Article, {
      foreignKey: 'categoryId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return Category;
};
