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
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    avatarUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue:
        'https://res.cloudinary.com/teamrambo50/image/upload/v1565160704/avatar-1577909_1280_xsoxql.png',
      validate: {
        isUrl: {
          msg: 'avatar url format is invalid'
        }
      }
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 160],
          msg: 'user bio must not be more than 160 characters'
        }
      }
    },
    followingsCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'user followings count must be an integer'
        },
        min: {
          args: [0],
          msg: 'user followings count must not be less than 0'
        }
      }
    },
    followersCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'user followers count must be an integer'
        },
        min: {
          args: [0],
          msg: 'user followers count must not be less than 0'
        }
      }
    },
    identifiedBy: {
      type: DataTypes.ENUM,
      values: ['fullname', 'username'],
      allowNull: true,
      defaultValue: 'fullname',
      validate: {
        isIn: {
          args: [['fullname', 'username']],
          msg: 'user must only be identified by either fullname or username'
        }
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^[a-zA-Z ]*$/,
          msg: 'user occupation must contain only letters and/or spaces'
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
    if (user) return user;
    return null;
  };

  User.findById = async (id) => {
    const user = await User.findOne({ where: { id } });
    if (user) return user;
    return null;
  };

  User.updatePasswordById = async (id, newPassword) => {
    const user = await User.update(
      { password: newPassword },
      { where: { id } }
    );
    return user[0];
  };
  User.associate = (models) => {
    User.hasMany(models.Session, {
      foreignKey: 'userId',
      as: 'sessions',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    User.hasMany(models.UserFollower, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'AllFollowers'
    });

    User.hasMany(models.UserFollower, {
      foreignKey: 'followerId',
      onDelete: 'CASCADE',
      as: 'AllFollowings'
    });

    User.belongsToMany(models.Category, {
      foreignKey: 'userId',
      otherKey: 'categoryId',
      through: 'UserCategory',
      as: 'PreferredCategories',
      timestamps: false
    });
    User.hasMany(models.ResetPassword, {
      foreignKey: 'userId',
      as: 'ResetPassword',
      onDelete: 'CASCADE'
    });
  };

  return User;
};
