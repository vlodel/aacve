const Sequlize = require("sequelize");
const constants = require("../constants");

const sequelize = new Sequlize(
  constants.DATABASE_NAME,
  constants.USERNAME,
  constants.PASSWORD,
  {
    dialect: constants.DIALECT
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection succseful");
  })
  .catch(err => {
    console.log("Error connecting to database:" + err.message);
  });

class User extends Sequlize.Model {}

User.init(
  {
    email: {
      type: Sequlize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequlize.STRING,
      allowNull: false
    }
  },
  { sequelize, modelName: "user" }
);

sequelize.sync();

module.exports = {
  sequelize,
  User
};
