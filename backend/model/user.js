const { Sequelize, DataTypes } = require('sequelize');
const constants = require('../constants');

const sequelize = new Sequelize(
  constants.DATABASE_NAME,
  constants.USERNAME,
  constants.PASSWORD,
  {
    dialect: constants.DIALECT,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to database has been established succesfully');
  })
  .catch((err) => {
    console.log('Unable to connect to database: ', err);
  });

// class User extends Sequelize.Model {}

// User.init(
//   {
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false
//     }
//   },
//   { sequelize, modelName: 'user' }
// );

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync();

module.exports = {
  sequelize,
  User,
};
