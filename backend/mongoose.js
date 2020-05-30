const mongoose = require('mongoose');
const cveSchema = require('./models/cve');
const userSchema = require('./models/user');

const server = '127.0.0.1:27017';
const database = 'aacve';

mongoose
  .connect(`mongodb://${server}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(
      'Connection to MongoDB database has been established succesfully'
    );
  })
  .catch((err) => {
    console.log('Unable to connect to database: ', err);
  });

const Cve = mongoose.model('cve', cveSchema);
const User = mongoose.model('user', userSchema);

module.exports = {
  Cve,
  User,
};
