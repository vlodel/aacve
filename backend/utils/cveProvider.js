const https = require('https');
const unzipper = require('unzipper');
const cheerio = require('cheerio');
const got = require('got');

const requestFile = (URL) => {
  https.get(URL, (result) => {
    result.pipe(unzipper.Extract({ path: './cves' }));
  });
  console.log(`${URL} downloaded.`);
};

const getCveFiles = async () => {
  try {
    const linksArray = [];

    const response = await got('https://nvd.nist.gov/vuln/data-feeds');
    const $ = cheerio.load(response.body);
    const tableRowsArray = $('#bodyNvdLayout').find('.xml-feed-data-row');
    tableRowsArray.each(function (index, element) {
      if (
        $(element).attr('data-testid').includes('-zip') &&
        !$(element).attr('data-testid').includes('tableCveFeeds0-') &&
        !$(element).attr('data-testid').includes('tableCveFeeds1-')
      ) {
        const td = $(element).find('td')[0];
        const anchor = $(td).find('a')[0];
        if (
          $(anchor).attr('href').includes('.json.zip') &&
          !$(anchor).attr('href').includes('nvdcpematch-1.0')
        ) {
          const link = 'https://nvd.nist.gov' + $(anchor).attr('href');
          linksArray.push(link);
        }
      }
    });

    linksArray.forEach((link) => {
      requestFile(link);
    });

    console.log('Finished downloading CVE files...');
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { getCveFiles };
