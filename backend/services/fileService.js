const fs = require('fs');
const path = require('path');
const docxParser = require('docx-parser');

const fileHandler = {
  analyzeFile: async (file) => {
    try {
      const dictionaryData = fs.readFileSync(
        path.join(__dirname, '../utils/dictionary.txt'),
        'utf-8'
      );
      const dictionaryKeywords = dictionaryData.split(/\r?\n/);
      console.log(file);

      // TODO: find a working regex for the keywords
      docxParser.parseDocx(file.path, function (data) {
        dictionaryKeywords.forEach((keyword) => {
          if ((data.match(keyword) || []).length != 0) {
            console.log(keyword);
          }
        });
      });

      //   const content = fs.readFileSync(file.path, file.endcoding).toString();

      //   console.log(content);

      // dictionaryKeywords.forEach((keyword) => {
      //   if ((content.match('\\b' + keyword + '\\b/g') || []).length != 0) {
      //     console.log(keyword);
      //   }
      // });

      //   dictionaryKeywords.forEach((keyword) => {
      //     console.log((content.match('\b' + keyword + '\b/g') || []).length);
      //   });

      //   dictionaryKeywords.forEach((keyword) => {
      //     console.log(keyword);
      //   });
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = fileHandler;
