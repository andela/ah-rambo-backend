export default (sequelize, DataTypes) => {
  const UserFollower = sequelize.define(
    'UserFollower',
    {
      userId: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            msg: 'userId must be an integer'
          }
        }
      },
      followerId: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            msg: 'followerId must be an integer'
          }
        }
      }
    },
    {}
  );
  UserFollower.associate = (models) => {
    UserFollower.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'following'
    });
    UserFollower.belongsTo(models.User, {
      foreignKey: 'followerId',
      onDelete: 'CASCADE',
      as: 'follower'
    });
  };
  return UserFollower;
};
