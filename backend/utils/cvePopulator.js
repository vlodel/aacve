//  node --max-old-space-size=4096 cvePopulator.js

const fs = require('fs');
const mongoose = require('mongoose');
const cveSchema = require('../models/cve');
const path = require('path');

const server = '127.0.0.1:27017';
const database = 'aacve';

const cveModel = mongoose.model('cve', cveSchema);

const updateDatabase = async () => {
  mongoose
    .connect(`mongodb://${server}/${database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(async () => {
      console.log('MongoDB connection successful.');
      const files = fs.readdirSync(path.join(__dirname, '../cves'));
      if (!files) {
        console.log(`Unable to read directory`);
      } else {
        for (const filePath of files) {
          const file = fs.readFileSync(
            path.join(__dirname, '../cves/' + filePath)
          );
          let jsonFile = JSON.parse(file);
          var cveArray = jsonFile.CVE_Items;

          await cveModel.bulkWrite(
            cveArray.map((cveObject) => ({
              updateOne: {
                filter: {
                  id: cveObject.cve.CVE_data_meta.ID,
                  references: cveObject.cve.references,
                  description: cveObject.cve.description,
                  impact: cveObject.impact,
                  publishedDate: cveObject.publishedDate,
                  lastModifiedDate: cveObject.lastModifiedDate,
                },
                update: cveObject,
                upsert: true,
              },
            }))
          );

          console.log(filePath + ' read.');
        }
      }
    })
    .then(() => {
      console.log('Finished updating the cves database...');
    })
    .catch((err) => {
      console.log(`MongoDB connection error: ${err}`);
    });
};

module.exports = { updateDatabase };
