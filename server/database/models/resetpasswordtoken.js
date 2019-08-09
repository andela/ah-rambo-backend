export default (sequelize, DataTypes) => {
  const ResetPassword = sequelize.define('ResetPassword', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  });
  return ResetPassword;
};
