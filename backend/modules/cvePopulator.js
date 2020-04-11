const fs = require('fs');
const { Cve } = require('../sequelize');
// const MongoClient = require('mongodb').MongoClient;
// const mongoose = require('mongoose');

// const uri =
//   'mongodb://127.0.0.1:27017/?compressors=zlib&gssapiServiceName=mongodb&useUnifiedTopology=true';
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect((err) => {
//   if (err) console.log(err);
// });
// const collection = client.db('aacve').collection('cve');

// function readFiles(callback) {
//   let cveArray = [];
//   fs.readdir('../cves', (err, files) => {
//     if (err) {
//       console.log(`Unable to read directory: ` + err);
//     } else {
//       files.forEach((filePath) => {
//         fs.readFile('../cves/' + filePath, (err, data) => {
//           let jsonFile = JSON.parse(data);
//           //cveArray.push(jsonFile.CVE_Items);
//           //console.log(cveArray);
//           var cveArray = jsonFile.CVE_Items;
//           callback(cveArray);
//         });
//       });
//       //callback(cveArray);
//     }
//   });
// }

// function populateDb(data) {
//   for (let i = 0; i < data.length; i++) {
//     // collection.save({ _id: data[i].cve.CVE_data_meta.ID }, (err, record) => {
//     //   if (err) console.log(err);
//     // });
//   }
//   collection.insertMany(data, (err, record) => {
//     if (err) console.log(err);
//     console.log('Data inserted');
//   });
// }

// readFiles(populateDb);
// client.close();

fs.readdir('../cves', (err, files) => {
  if (err) {
    console.log(`Unable to read directory: ` + err);
  } else {
    files.forEach((filePath) => {
      fs.readFile('../cves/' + filePath, (err, data) => {
        let jsonFile = JSON.parse(data);
        var cveArray = jsonFile.CVE_Items;
        for (let i = 0; i < cveArray.length; i++) {
          console.log(cveArray[i].cve.CVE_data_meta.ID);
        }
      });
    });
  }
});

/**
 * try to find a way to upsert the current records from the mongoDb
 * TODO: implement this module so that at every startup of the server it deletes the records of cves from the mongoDb and inserts the updated ones
 *
 */
