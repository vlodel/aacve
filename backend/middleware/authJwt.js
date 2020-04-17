const jwt = require('jsonwebtoken');
const config = require('../config/authConfig');
const model = require('../sequelize');
const User = model.User;

const verifyToken = (req, res) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      message: 'No auth token provided',
    });
  }

  jwt.verify(token, config.secret, (err, decode) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized',
      });
    }

    req.email = decode.email;
  });
};

module.exports = { verifyToken };
