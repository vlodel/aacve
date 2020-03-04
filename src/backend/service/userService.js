const { User } = require('../model/user');

const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserService {
  static async createUser(newUser) {
    try {
      bcrypt.hash(newUser.password, saltRounds, async (err, hash) => {
        return await User.create({
          email: newUser.email,
          password: hash
        });
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  static async loginUser(user) {
    try {
      const requestUser = await User.findOne({
        where: {
          email: user.email
        }
      });

      bcrypt.compare(user.password, requestUser.password, (err, result) => {
        console.log('service' + result);
        if (result) {
          return requestUser;
        } else {
          return null;
        }
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}

const user = {
  authUser: async user => {
    try {
      const result = await User.findOne({
        where: {
          email: user.email
        }
      });

      return result;
    } catch (err) {
      throw new Error(err);
    }
  }
};

module.exports = {
  UserService,
  user
};
