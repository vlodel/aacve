const { Sequelize } = require('sequelize');
const dbConfig = require('./config/dbConfig');
const userModel = require('./models/user');
const cveModel = require('./models/cveSequelizeDontUse');

const sequelize = new Sequelize(
  dbConfig.DATABASE_NAME,
  dbConfig.USERNAME,
  dbConfig.PASSWORD,
  {
    dialect: dbConfig.DIALECT,
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

sequelize.sync();

module.exports = { User };
