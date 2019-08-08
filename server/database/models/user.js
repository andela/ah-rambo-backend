export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'names must be strings between 2 and 50 chars long'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'names must be strings between 2 and 50 chars long'
        }
      }
    },
    userName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      validate: {
        isAlphanumeric: {
          msg: 'username must be alphanumeric'
        },
        len: {
          args: [6, 15],
          msg: 'username must be between 6 and 15 chars long'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'email address provided be a valid'
        },
        len: {
          args: [5, 100],
          msg: 'email must be between 5 and 100 chars long'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [8, 254],
          msg: 'Password must be between 8 and 254 chars long'
        }
      }
    }
  });
  User.findByEmail = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (user) return user.dataValues;
    return null;
  };
  User.findByUsername = async (userName) => {
    const user = await User.findOne({ where: { userName } });
    if (user) return user.dataValues;
    return null;
  };
  User.findById = async (id) => {
    const user = await User.findOne({ where: { id } });
    if (user) return user;
    return null;
  };
  User.associate = (models) => {
    User.hasMany(models.Session, {
      foreignKey: 'userId',
      as: 'sessions',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return User;
};
