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
