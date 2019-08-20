export default (sequelize, DataTypes) => {
  const Dislike = sequelize.define('Dislike', {
    userId: DataTypes.INTEGER,
    contentType: DataTypes.STRING,
    contentId: DataTypes.INTEGER
  });

  Dislike.associate = (models) => {
    Dislike.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };

  return Dislike;
};
