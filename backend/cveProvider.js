const https = require('https');
const unzipper = require('unzipper');
const cheerio = require('cheerio');
const got = require('got');

const requestFile = (URL) => {
  https.get(URL, (result) => {
    result.pipe(unzipper.Extract({ path: './cves' }));
  });
};

const cveProvider = async () => {
  try {
    var linksArray = [];

    const response = await got('https://nvd.nist.gov/vuln/data-feeds');
    const $ = cheerio.load(response.body);
    var tableRowsArray = $('#form').find('.xml-feed-data-row');
    tableRowsArray.each(function (index, element) {
      if ($(element).attr('data-testid').includes('vuln-json-feed-row-zip')) {
        var td = $(element).find('td')[0];
        var anchor = $(td).find('a')[0];
        // console.log($(anchor).attr('href'));
        var link = $(anchor).attr('href');
        linksArray.push(link);
      }
    });

    linksArray.forEach((link) => {
      requestFile(link);
    });
  } catch (err) {
    console.log(err.message);
  }
};

exports.getCveFiles = cveProvider;
