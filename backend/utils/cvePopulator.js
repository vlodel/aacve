//  node --max-old-space-size=4096 cvePopulator.js

const fs = require('fs');
const mongoose = require('mongoose');
const cveModel = require('../models/cve');

const server = '127.0.0.1:27017';
const database = 'aacve';

mongoose
  .connect(`mongodb://${server}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('MongoDB connection successful.');

    fs.readdir('../cves', async (err, files) => {
      if (err) {
        console.log(`Unable to read directory: ` + err);
      } else {
        files.forEach((filePath) => {
          fs.readFile('../cves/' + filePath, (err, data) => {
            let jsonFile = JSON.parse(data);
            var cveArray = jsonFile.CVE_Items;

            for (const cveItem of cveArray) {
              if (
                !cveItem.cve.description.description_data[0].value.includes(
                  '** REJECT **'
                )
              ) {
                let optimizedCve = new cveModel({
                  id: cveItem.cve.CVE_data_meta.ID,
                  references: cveItem.cve.references,
                  description: cveItem.cve.description,
                  impact: cveItem.impact,
                  publishedDate: cveItem.publishedDate,
                  lastModifiedDate: cveItem.lastModifiedDate,
                });
                cveModel.findOneAndUpdate(
                  { id: optimizedCve.id },
                  optimizedCve,
                  { upsert: true, useFindAndModify: false },
                  (err, doc) => {
                    if (err) console.log(err);
                  }
                );
              }
            }
            console.log(filePath + ' read.');
          });
        });
      }
    });
  })
  .then(() => {
    mongoose.disconnect();
    console.log('Finished updating the cves database.');
    console.log('MongoDB connection ended.');
  })
  .catch((err) => {
    console.log(`MongoDB connection error: ${err}`);
  });