const { User } = require('../sequelize');

const user = {
  createUser: async (newUser) => {
    try {
      const existingUser = await User.findOne({
        where: {
          email: newUser.email,
        },
      });

      if (!existingUser) {
        return await User.create({
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          password: newUser.password,
        });
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
        where: {
          email: user.email,
        },
      });

      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
};

module.exports = user;
