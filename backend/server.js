const express = require('express');
const bodyParser = require('body-parser');

const router = require('./routes/routes');
const app = express();

app.use(bodyParser.json());
app.use('/api', router);

app.listen(8080, () => {
  console.log('Server started on port 8080...');
});

const cveProvider = require('./modules/cveProvider');

cveProvider.getCveFiles();
