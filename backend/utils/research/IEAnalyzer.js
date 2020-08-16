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

const securityTerms = [
  { term: 'security', score: '100' },
  { term: 'secure', score: '100' },
  { term: 'vulnerability', score: '90' },
  { term: 'vulnerabilities', score: '90' },
  { term: 'risk', score: '70' },
  { term: 'risks', score: '70' },
  { term: 'attack', score: '70' },
  { term: 'attacks', score: '70' },
  { term: 'threat', score: '80' },
  { term: 'threats', score: '80' },
  { term: 'countermeasures', score: '40' },
  { term: 'countermeasure', score: '40' },
  { term: 'critical', score: '40' },
  { term: 'defend', score: '30' },
];

const articlesMetadata = [];
const finalData = [];

const IEanalyzer = async () => {
  // fs.createReadStream(path.join(__dirname, './securityTerms.csv'))
  //   .pipe(csv())
  //   .on('data', (row) => {
  //     securityTerms.push(row);
  //   })
  //   .on('end', () => {
  //     console.log('CSV file successfully read');
  //     console.log(securityTerms);
  //   });

  fs.readdir(path.join(__dirname, './IEMagazine'), async (err, filesNames) => {
    if (err) console.log(err);

    fs.createReadStream(path.join(__dirname, './articlesMetadata.csv'))
      .pipe(csv())
      .on('data', (row) => {
        articlesMetadata.push(row);
      })
      .on('end', async () => {
        console.log('CSV with articles metadata file successfully read');

        for (let i = 0; i < filesNames.length; i++) {
          var csvSecurityTerms = [];
          var csvSecurityTermsScore = 0;
          const fileName = filesNames[i].replace('.pdf', '');
          var issue = '';
          var URL = '';

          for (let j = 0; j < securityTerms.length; j++) {
            let termRegexp = new RegExp(`\\b${securityTerms[j].term}\\b`, 'gi');

            if (fileName.match(termRegexp)) {
              let currentArticleMetadata = articlesMetadata.find(
                (data) => data['articleTitle'] === fileName
              );
              issue = currentArticleMetadata.issue.replace(/\s+/g, ' ').trim();
              URL = currentArticleMetadata.URL;

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

              var filtersResults = await cveService.analysisSearch(mockBody);
              // console.log(filtersResults);
              var allFiltersAvgBaseScoreV2 =
                (filtersResults[0].avgBaseScoreV2 +
                  filtersResults[1].avgBaseScoreV2 +
                  filtersResults[2].avgBaseScoreV2 +
                  filtersResults[3].avgBaseScoreV2 +
                  filtersResults[4].avgBaseScoreV2) /
                5;
              var allFiltersAvgBaseScoreV3 =
                (filtersResults[0].avgBaseScoreV3 +
                  filtersResults[1].avgBaseScoreV3 +
                  filtersResults[2].avgBaseScoreV3 +
                  filtersResults[3].avgBaseScoreV3 +
                  filtersResults[4].avgBaseScoreV3) /
                5;
              console.log(allFiltersAvgBaseScoreV2);
              console.log(allFiltersAvgBaseScoreV3);

              if (
                !finalData.some((data) => data['articleTitle'] === fileName)
              ) {
                finalData.push({
                  articleTitle: fileName,
                  issue: issue,
                  URL: URL,
                  filter1: filtersResults[0].id,
                  noVulnerabilitiesFilter1: filtersResults[0].count,
                  avgBaseScoreV2Filter1: filtersResults[0].avgBaseScoreV2,
                  avgBaseScoreV3Filter1: filtersResults[0].avgBaseScoreV3,
                  filter2: filtersResults[1].id,
                  noVulnerabilitiesFilter2: filtersResults[1].count,
                  avgBaseScoreV2Filter2: filtersResults[1].avgBaseScoreV2,
                  avgBaseScoreV3Filter2: filtersResults[1].avgBaseScoreV3,
                  filter3: filtersResults[2].id,
                  noVulnerabilitiesFilter3: filtersResults[2].count,
                  avgBaseScoreV2Filter3: filtersResults[2].avgBaseScoreV2,
                  avgBaseScoreV3Filter3: filtersResults[2].avgBaseScoreV3,
                  filter4: filtersResults[3].id,
                  noVulnerabilitiesFilter4: filtersResults[3].count,
                  avgBaseScoreV2Filter4: filtersResults[3].avgBaseScoreV2,
                  avgBaseScoreV3Filter4: filtersResults[3].avgBaseScoreV3,
                  filter5: filtersResults[4].id,
                  noVulnerabilitiesFilter5: filtersResults[4].count,
                  avgBaseScoreV2Filter5: filtersResults[4].avgBaseScoreV2,
                  avgBaseScoreV3Filter5: filtersResults[4].avgBaseScoreV3,
                  allFiltersAvgBaseScoreV2: Number(
                    allFiltersAvgBaseScoreV2.toFixed(3)
                  ),
                  allFiltersAvgBaseScoreV3: Number(
                    allFiltersAvgBaseScoreV3.toFixed(3)
                  ),
                  securityTerms: csvSecurityTerms,
                  securityTermsScore: csvSecurityTermsScore,
                });
              } else {
                let existingRow = finalData.find(
                  (data) => data['articleTitle'] === fileName
                );
                existingRow.securityTermsScore = csvSecurityTermsScore;
              }
            }
          }
        }

        csvWriter.writeRecords(finalData).then(() => {
          console.log('CSV file written.');
        });
      });
  });
};

IEanalyzer();
