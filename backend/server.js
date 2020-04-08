const express = require('express');
const bodyParser = require('body-parser');

const router = require('./routes/routes');
const app = express();

app.use(bodyParser.json());
app.use('/api', router);

app.listen(8080, () => {
  console.log('Server started on port 8080...');
});

const https = require('https');
const fs = require('fs');
const req = require('request');
const { parse } = require('node-html-parser');

req(
  {
    uri: 'https://cve.mitre.org/data/downloads/index.html',
  },
  (error, response, body) => {
    const html = parse(body);
    const lastDownloadedDataInformation = html.querySelector('.smaller');
    console.log(lastDownloadedDataInformation.text);
  }
);

const file = fs.createWriteStream('allitems.xml');

const request = https.get(
  'https://cve.mitre.org/data/downloads/allitems.xml',
  (res) => {
    res.pipe(file);
    console.log('Finished updating cve entries.');
  }
);
