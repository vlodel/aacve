const jwt = require('jsonwebtoken');
const config = require('../config/authConfig');
const { User } = require('../sequelize');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  console.log(authHeader);

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Unauthorized' });
      } else {
        User.findOne({ where: { email: decoded.email } })
          .then((result) => {
            req.user = result;
            next();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  } else {
    return res.status(403).send({
      message: 'No auth token provided',
    });
  }

  // const authHeader = req.headers.authorization;
  // const token = authHeader.split(' ')[1];

  // console.log(token);
};

module.exports = { verifyToken };
