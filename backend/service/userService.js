const { User } = require('../model/user');

class UserService {
  static async createUser(newUser) {
    try {
      const existingUser = await User.findOne({
        where: {
          email: newUser.email
        }
      });

      if (!existingUser) {
        return await User.create({
          email: newUser.email,
          password: newUser.password
        });
      } else {
        existingUser.exists = true;
        return existingUser;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  static async loginUser(user) {
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
}

module.exports = {
  UserService
};
