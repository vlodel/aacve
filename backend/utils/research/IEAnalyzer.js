const fileService = require('../../services/fileService');
const cveService = require('../../services/cveService');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'results.csv',
  header: [
    { id: 'articleTitle', title: 'articleTitle' },
    { id: 'issue', title: 'issue' },
    { id: 'URL', title: 'URL' },
    { id: 'filter1', title: 'filter1' },
    { id: 'noVulnerabilitiesFilter1', title: 'noVulnerabilitiesFilter1' },
    { id: 'avgBaseScoreV2Filter1', title: 'avgBaseScoreV2Filter1' },
    { id: 'avgBaseScoreV3Filter1', title: 'avgBaseScoreV3Filter1' },
    { id: 'filter2', title: 'filter2' },
    { id: 'noVulnerabilitiesFilter2', title: 'noVulnerabilitiesFilter2' },
    { id: 'avgBaseScoreV2Filter2', title: 'avgBaseScoreV2Filter2' },
    { id: 'avgBaseScoreV3Filter2', title: 'avgBaseScoreV3Filter2' },
    { id: 'filter3', title: 'filter3' },
    { id: 'noVulnerabilitiesFilter3', title: 'noVulnerabilitiesFilter3' },
    { id: 'avgBaseScoreV2Filter3', title: 'avgBaseScoreV2Filter3' },
    { id: 'avgBaseScoreV3Filter3', title: 'avgBaseScoreV3Filter3' },
    { id: 'filter4', title: 'filter4' },
    { id: 'noVulnerabilitiesFilter4', title: 'noVulnerabilitiesFilter4' },
    { id: 'avgBaseScoreV2Filter4', title: 'avgBaseScoreV2Filter4' },
    { id: 'avgBaseScoreV3Filter4', title: 'avgBaseScoreV3Filter4' },
    { id: 'filter5', title: 'filter5' },
    { id: 'noVulnerabilitiesFilter5', title: 'noVulnerabilitiesFilter5' },
    { id: 'avgBaseScoreV2Filter5', title: 'avgBaseScoreV2Filter5' },
    { id: 'avgBaseScoreV3Filter5', title: 'avgBaseScoreV3Filter5' },
    { id: 'allFiltersAvgBaseScoreV2', title: 'allFiltersAvgBaseScoreV2' },
    { id: 'allFiltersAvgBaseScoreV3', title: 'allFiltersAvgBaseScoreV3' },
    { id: 'securityTerms', title: 'securityTerms' },
    { id: 'securityTermsScore', title: 'securityTermsScore' },
  ],
});

const securityTerms = [];
const articlesMetadata = [];
const finalData = [];

const addDataToResult = async (
  articleTitle,
  issue,
  URL,
  filtersResults,
  securityTerms,
  securityTermsScore
) => {
  result.push({
    articleTitle: articleTitle,
    issue: issue,
    URL: URL,
    filter1:
      typeof filtersResults[0].id === 'undefined'
        ? 'no filter'
        : filtersResults[0].id,
    noVulnerabilitiesFilter1:
      typeof filtersResults[0].count === 'undefined'
        ? '0'
        : filtersResults[0].count,
    avgBaseScoreV2Filter1:
      typeof filtersResults[0].avgBaseScoreV2 === 'undefined'
        ? '0'
        : filtersResults[0].avgBaseScoreV2,
    avgBaseScoreV3Filter1:
      typeof filtersResults[0].avgBaseScoreV3 === 'undefined'
        ? '0'
        : filtersResults[0].avgBaseScoreV3,
    filter2:
      typeof filtersResults[1].id === 'undefined'
        ? 'no filter'
        : filtersResults[1].id,
    noVulnerabilitiesFilter2:
      typeof filtersResults[1].count === 'undefined'
        ? '0'
        : filtersResults[1].count,
    avgBaseScoreV2Filter2:
      typeof filtersResults[1].avgBaseScoreV2 === 'undefined'
        ? '0'
        : filtersResults[1].avgBaseScoreV2,
    avgBaseScoreV3Filter2:
      typeof filtersResults[1].avgBaseScoreV3 === 'undefined'
        ? '0'
        : filtersResults[1].avgBaseScoreV3,
    filter3:
      typeof filtersResults[2].id === 'undefined'
        ? 'no filter'
        : filtersResults[2].id,
    noVulnerabilitiesFilter3:
      typeof filtersResults[2].count === 'undefined'
        ? '0'
        : filtersResults[2].count,
    avgBaseScoreV2Filter3:
      typeof filtersResults[2].avgBaseScoreV2 === 'undefined'
        ? '0'
        : filtersResults[2].avgBaseScoreV2,
    avgBaseScoreV3Filter3:
      typeof filtersResults[2].avgBaseScoreV3 === 'undefined'
        ? '0'
        : filtersResults[2].avgBaseScoreV3,
    filter4:
      typeof filtersResults[3].id === 'undefined'
        ? 'no filter'
        : filtersResults[3].id,
    noVulnerabilitiesFilter4:
      typeof filtersResults[3].count === 'undefined'
        ? '0'
        : filtersResults[3].count,
    avgBaseScoreV2Filter4:
      typeof filtersResults[3].avgBaseScoreV2 === 'undefined'
        ? '0'
        : filtersResults[3].avgBaseScoreV2,
    avgBaseScoreV3Filter4:
      typeof filtersResults[3].avgBaseScoreV3 === 'undefined'
        ? '0'
        : filtersResults[3].avgBaseScoreV3,
    filter5:
      typeof filtersResults[4].id === 'undefined'
        ? 'no filter'
        : filtersResults[4].id,
    noVulnerabilitiesFilter5:
      typeof filtersResults[4].count === 'undefined'
        ? '0'
        : filtersResults[4].count,
    avgBaseScoreV2Filter5:
      typeof filtersResults[4].avgBaseScoreV2 === 'undefined'
        ? '0'
        : filtersResults[4].avgBaseScoreV2,
    avgBaseScoreV3Filter5:
      typeof filtersResults[4].avgBaseScoreV3 === 'undefined'
        ? '0'
        : filtersResults[4].avgBaseScoreV3,
    allFiltersAvgBaseScoreV2:
      typeof allFiltersAvgBaseScoreV2 === 'undefined'
        ? '0'
        : Number(allFiltersAvgBaseScoreV2.toFixed(3)),
    allFiltersAvgBaseScoreV3:
      typeof allFiltersAvgBaseScoreV3 === 'undefined'
        ? 0
        : Number(allFiltersAvgBaseScoreV3.toFixed(3)),
    securityTerms: securityTerms,
    securityTermsScore: securityTermsScore,
  });
};

const IEanalyzer = async () => {
  fs.createReadStream(path.join(__dirname, './securityTerms_v2.csv'))
    .pipe(csv(['term', 'score']))
    .on('data', (row) => {
      row.score = Number(row.score);
      securityTerms.push(row);
    })
    .on('end', () => {
      console.log('CSV file successfully read');
      console.log(securityTerms);

      fs.readdir(
        path.join(__dirname, './IEMagazine'),
        async (err, filesNames) => {
          if (err) console.log(err);

          fs.createReadStream(path.join(__dirname, './articlesMetadata.csv'))
            .pipe(csv())
            .on('data', (row) => {
              articlesMetadata.push(row);
            })
            .on('end', async () => {
              console.log('Articles metadata CSV file successfully read');

              for (let i = 0; i < filesNames.length; i++) {
                console.log(filesNames[i]);

                var csvSecurityTerms = [];
                var csvSecurityTermsScore = 0;
                const fileName = filesNames[i].replace('.pdf', '');

                let currentArticleMetadata = articlesMetadata.find(
                  (data) => data['articleTitle'] === fileName
                );
                let issue = currentArticleMetadata.issue
                  .replace(/\s+/g, ' ')
                  .trim();
                let URL = currentArticleMetadata.URL;

                for (let j = 0; j < securityTerms.length; j++) {
                  let termRegexp = new RegExp(
                    `\\b${securityTerms[j].term}\\b`,
                    'gi'
                  );

                  //security terms article condition
                  if (fileName.match(termRegexp)) {
                    csvSecurityTerms.push(securityTerms[j].term);
                    csvSecurityTermsScore += Number(securityTerms[j].score);

                    let file = {};
                    file.buffer = fs.readFileSync(
                      path.join(__dirname, '/IEMagazine/' + filesNames[i])
                    );
                    file.mimetype = 'application/pdf';

                    var fileResults = await fileService.analyzeFile(file);
                    fileResult = fileResults.slice(
                      Math.max(fileResults.length - 5, 1)
                    );

                    var filters = [];
                    for (let i = 0; i < fileResult.length; i++) {
                      filters.push(fileResult[i].id);
                    }

                    var mockBody = {
                      filters: filters,
                      startDate: '2010-01-01T15:05:38.000Z',
                      endDate: new Date(),
                    };

                    var filtersResults = await cveService.analysisSearch(
                      mockBody
                    );

                    if (filtersResults.length === 5) {
                      console.log(filtersResults);
                      var allFiltersAvgBaseScoreV2 = 0;
                      var allFiltersAvgBaseScoreV3 = 0;

                      for (let i = 0; i < filtersResults.length; i++) {
                        allFiltersAvgBaseScoreV2 +=
                          filtersResults[i].avgBaseScoreV2;
                        allFiltersAvgBaseScoreV3 +=
                          filtersResults[i].avgBaseScoreV3;
                      }

                      console.log(allFiltersAvgBaseScoreV2);

                      allFiltersAvgBaseScoreV2 =
                        allFiltersAvgBaseScoreV2 / filtersResults.length;
                      allFiltersAvgBaseScoreV3 =
                        allFiltersAvgBaseScoreV3 / filtersResults.length;

                      console.log(allFiltersAvgBaseScoreV2);
                      console.log(allFiltersAvgBaseScoreV3);

                      if (
                        !finalData.some(
                          (data) => data['articleTitle'] === fileName
                        )
                      ) {
                        addDataToResult(
                          finalData,
                          issue,
                          URL,
                          filtersResults,
                          csvSecurityTerms,
                          csvSecurityTermsScore
                        );
                      } else {
                        let existingRow = finalData.find(
                          (data) => data['articleTitle'] === fileName
                        );
                        existingRow.securityTermsScore = csvSecurityTermsScore;
                      }
                    }
                  }
                }

                if (
                  !finalData.some((data) => data['articleTitle'] === fileName)
                ) {
                  let file = {};
                  file.buffer = fs.readFileSync(
                    path.join(__dirname, '/IEMagazine/' + filesNames[i])
                  );
                  file.mimetype = 'application/pdf';

                  var fileResults = await fileService.analyzeFile(file);
                  fileResult = fileResults.slice(
                    Math.max(fileResults.length - 5, 1)
                  );

                  var filters = [];
                  for (let i = 0; i < fileResult.length; i++) {
                    filters.push(fileResult[i].id);
                  }

                  var mockBody = {
                    filters: filters,
                    startDate: '2010-01-01T15:05:38.000Z',
                    endDate: new Date(),
                  };

                  var filtersResults = await cveService.analysisSearch(
                    mockBody
                  );
                  if (filtersResults.length === 5) {
                    console.log(filtersResults);

                    var allFiltersAvgBaseScoreV2 = 0;
                    var allFiltersAvgBaseScoreV3 = 0;

                    for (let i = 0; i < filtersResults.length; i++) {
                      allFiltersAvgBaseScoreV2 +=
                        filtersResults[i].avgBaseScoreV2;
                      allFiltersAvgBaseScoreV3 +=
                        filtersResults[i].avgBaseScoreV3;
                    }

                    allFiltersAvgBaseScoreV2 =
                      allFiltersAvgBaseScoreV2 / filtersResults.length;
                    allFiltersAvgBaseScoreV3 =
                      allFiltersAvgBaseScoreV3 / filtersResults.length;

                    console.log(allFiltersAvgBaseScoreV2);
                    console.log(allFiltersAvgBaseScoreV3);

                    addDataToResult(
                      finalData,
                      issue,
                      URL,
                      filtersResults,
                      '',
                      0
                    );
                  }
                }
              }

              csvWriter.writeRecords(finalData).then(() => {
                console.log('CSV file written.');
              });
            });
        }
      );
    });
};

IEanalyzer();
