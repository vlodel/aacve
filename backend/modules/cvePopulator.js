const fs = require('fs');

fs.readdir('../cves', (err, files) => {
  if (err) {
    console.log(`Unable to read directory: ` + err);
  } else {
    files.forEach((filePath) => {
      fs.readFile('../cves/' + filePath, (err, data) => {
        let jsonFile = JSON.parse(data);
        console.log(jsonFile);
      });
    });
  }
});
