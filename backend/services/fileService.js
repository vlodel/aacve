const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdf = require('pdf-parse');

const fileHandler = {
  analyzeFile: async (file) => {
    const dictionaryData = fs.readFileSync(
      path.join(__dirname, '../utils/dictionary.txt'),
      'utf-8'
    );
    const dictionaryKeywords = dictionaryData.split(/\r?\n/);

    var resultsMap = [];

    if (file.mimetype === 'application/pdf') {
      let dataBuffer = file;
      // console.log(dataBuffer);

      const documentData = await pdf(dataBuffer.buffer);
      // console.log(documentData);

      dictionaryKeywords.forEach((keyword) => {
        var keywordRegexp = new RegExp(`\\b${keyword}\\b`, 'gi');
        if ((documentData.text.match(keywordRegexp) || []).length != 0) {
          var occurencesCount = (documentData.text.match(keywordRegexp) || [])
            .length;
          if (occurencesCount > 1) {
            var keywordResult = {
              id: keyword,
              count: occurencesCount,
            };
            resultsMap.push(keywordResult);
          }
        }
      });
    } else {
      const documentData = (await mammoth.extractRawText(file)).value;

      dictionaryKeywords.forEach((keyword) => {
        var keywordRegexp = new RegExp(`\\b${keyword}\\b`, 'g');
        if ((documentData.match(keywordRegexp) || []).length != 0) {
          var occurencesCount = (documentData.match(keywordRegexp) || [])
            .length;
          if (occurencesCount > 1) {
            var keywordResult = {
              id: keyword,
              count: occurencesCount,
            };
            resultsMap.push(keywordResult);
          }
        }
      });
    }

    if (resultsMap) {
      resultsMap.sort((a, b) => {
        return a.count - b.count;
      });
    }

    return resultsMap;
  },
};

module.exports = fileHandler;
