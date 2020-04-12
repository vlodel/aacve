const { Sequelize } = require('sequelize');
const constants = require('./constants');
const userModel = require('./models/user');
const cveModel = require('./models/cveSequelizeDontUse');

const sequelize = new Sequelize(
  constants.DATABASE_NAME,
  constants.USERNAME,
  constants.PASSWORD,
  {
    dialect: constants.DIALECT,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to database has been established succesfully');
  })
  .catch((err) => {
    console.log('Unable to connect to database: ', err);
  });

const User = userModel(sequelize, Sequelize);
const Cve = cveModel(sequelize, Sequelize);

sequelize.sync({ force: true });

// const fs = require('fs');
// fs.readdir('./cves', (err, files) => {
//   if (err) {
//     console.log(`Unable to read directory: ` + err);
//   } else {
//     files.forEach((filePath) => {
//       fs.readFile('./cves/' + filePath, (err, data) => {
//         let jsonFile = JSON.parse(data);
//         var cveArray = jsonFile.CVE_Items;
//         for (let i = 0; i < cveArray.length; i++) {
//           console.log(cveArray[i].cve.CVE_data_meta.ID);
//           console.log(cveArray[i].cve.references.reference_data[0].url);
//           console.log(cveArray[i].cve.description.description_data[0].value);
//           console.log(cveArray[i].impact.baseMetricV3.cvssV3.vectorString);

//           Cve.create({
//             id: cveArray[i].cve.CVE_data_meta.ID,
//             reference: cveArray[i].cve.references.reference_data[0].url,
//             description: cveArray[i].cve.description.description_data.value,
//             v3Vector:
//               cveArray[i].impact.baseMetricV3.cvssV3.vectorString || 'none',
//           });
//         }
//       });
//     });
//   }
// });

module.exports = { User, Cve };
