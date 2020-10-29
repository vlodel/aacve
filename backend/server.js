const schedule = require('node-schedule');
const cveProvider = require('./utils/cveProvider');
const cvePopulator = require('./utils/cvePopulator');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./routes/routes');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', router);

app.listen(8080, () => {
  console.log('Server started on port 8080...');
});

schedule.scheduleJob('0 0 * * *', () => {
  cveProvider.getCveFiles();
});

schedule.scheduleJob('5 0 * * *', () => {
  cvePopulator.updateDatabase();
});
