const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./routes/routes');
const app = express();

app.use(cors());
app.use(bodyParser.json());
// app.use((req, res) => {
//   res.header(
//     'Access-Control-Allow-Headers',
//     'x-access-token, Origin, Content-Type, Accept'
//   );
// });
app.use('/api', router);

app.listen(8080, () => {
  console.log('Server started on port 8080...');
});

const cveProvider = require('./utils/cveProvider');

//cveProvider.getCveFiles();
