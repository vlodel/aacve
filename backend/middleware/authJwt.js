const jwt = require('jsonwebtoken');
const config = require('../config/authConfig');

//TODO: make the verifyToken module functional as the token never gets verified

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
