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
