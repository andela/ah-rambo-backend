module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    'Sessions',
    {
      userId: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
      devicePlatform: DataTypes.STRING,
      expiresAt: DataTypes.DATE,
      ipAddress: DataTypes.STRING,
      token: DataTypes.STRING,
      userAgent: DataTypes.STRING
    },
    {}
  );
  Session.associate = function (models) {
    // associations can be defined here
  };
  return Session;
};
