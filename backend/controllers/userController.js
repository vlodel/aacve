const userService = require('../services/userService');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const createUser = async (req, res) => {
  const user = req.body;

  if (user.firstName && user.lastName && user.email && user.password) {
    bcrypt.hash(user.password, saltRounds, async (err, hash) => {
      user.password = hash;
      const result = await userService.UserService.createUser(user);

      if (result.exists == true) {
        res.status(400).send({ message: 'User already exists' });
      } else {
        res.status(201).send({ message: 'User added succsefully' });
      }
    });
  } else {
    res.status(400).send({ message: 'Invalid payload' });
  }
};

const loginUser = async (req, res) => {
  const inputUser = req.body;

  if (
    inputUser.firstName &&
    inputUser.lastName &&
    inputUser.email &&
    inputUser.password
  ) {
    const resultUser = await userService.UserService.loginUser(inputUser);

    if (resultUser) {
      bcrypt.compare(inputUser.password, resultUser.password, (err, result) => {
        if (result == true) {
          res.status(200).send({ message: 'Login successful' });
        } else {
          res.status(404).send({ message: 'Incorrect password' });
        }
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  }
};

module.exports = {
  createUser,
  loginUser,
};
