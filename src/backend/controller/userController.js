const userService = require("../service/userService");

const createUser = async (req, res) => {
  const user = req.body;
  if (user.email && user.password) {
    const result = await userService.UserService.createUser(user);
    res.status(201).send({ message: "User added succsefully" });
  } else {
    res.status(400).send({ message: "Invalid payload" });
  }
};

module.exports = {
  createUser
};
