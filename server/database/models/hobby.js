export default (sequelize, DataTypes) => {
  const Hobby = sequelize.define(
    'Hobby',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      }
    },
    {}
  );

  Hobby.associate = (models) => {
    Hobby.belongsToMany(models.User, {
      foreignKey: 'hobbyId',
      otherKey: 'userId',
      through: 'UserHobby',
      as: 'users'
    });
  };
  return Hobby;
};
