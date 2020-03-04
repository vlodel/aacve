const userService = require('../service/userService');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const createUser = async (req, res) => {
  const user = req.body;

  if (user.email && user.password) {
    await userService.UserService.createUser(user);
    res.status(201).send({ message: 'User added succsefully' });
  } else {
    res.status(400).send({ message: 'Invalid payload' });
  }
};

const loginUser = async (req, res) => {
  const inputUser = req.body;

  if (inputUser.email && inputUser.password) {
    const resultUser = await userService.user.authUser(inputUser);

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
  loginUser
};
