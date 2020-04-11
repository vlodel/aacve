const { Sequelize } = require('sequelize');
const constants = require('./constants');
const userModel = require('./models/user');

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

const User = userModel(sequelize, Sequelize);

sequelize.sync({ force: true });

module.exports = User;
