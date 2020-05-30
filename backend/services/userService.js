const { User } = require('../mongoose');

const user = {
  createUser: async (newUser) => {
    try {
      const existingUser = await User.findOne({ email: newUser.email });

      if (!existingUser) {
        const createdUser = await User.create({
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          password: newUser.password,
        });

        return createdUser;
      } else {
        existingUser.exists = true;
        return existingUser;
      }
    } catch (err) {
      throw new Error(err);
    }
  },

  loginUser: async (user) => {
    try {
      const result = await User.findOne({
        email: user.email,
      });

      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
};

module.exports = user;
