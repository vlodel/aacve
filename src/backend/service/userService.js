const { User } = require("../model/user");

class UserService {
  static async createUser(newUser) {
    try {
      return await User.create(newUser);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = {
  UserService
};
