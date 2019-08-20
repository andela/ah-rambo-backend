export default (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: DataTypes.INTEGER,
    contentType: DataTypes.STRING,
    contentId: DataTypes.INTEGER
  });

  Like.associate = (models) => {
    Like.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return Like;
};
