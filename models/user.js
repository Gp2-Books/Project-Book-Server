'use strict';
const bcrypt = require('bcryptjs')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        isEmpty: function(value) {
          if(value == '' || value == undefined) {
            throw new Error('Email harus diisi!')
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate : {
        isEmpty: function(value) {
          if(value == '' || value == undefined) {
            throw new Error('Password harus diisi!')
          }
        }
      }
    } 
  }, {
    hooks: {
      beforeCreate(instance, option) {
        let salt = bcrypt.genSaltSync(8)
        instance.password = bcrypt.hashSync(instance.password, salt)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};