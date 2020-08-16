const http = require('http');
const cheerio = require('cheerio');
const got = require('got');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'articlesMetadata.csv',
  header: [
    { id: 'articleTitle', title: 'articleTitle' },
    { id: 'issue', title: 'issue' },
    { id: 'URL', title: 'URL' },
  ],
});

const csvData = [];

const requestFile = async (URL, fileName) => {
  http.get(URL, (response) => {
    const file = fs.createWriteStream(
      path.join(__dirname, './IEMagazine') + '/' + fileName + '.pdf'
    );
    response.pipe(file);
  });
  console.log(`${URL} downloaded.`);
};

const IEParser = async () => {
  try {
    var issuesLinks = [];
    var contentLinks = [];
    issuesLinks.push('http://www.revistaie.ase.ro/current.html');

    const response = await got('http://www.revistaie.ase.ro/archive.html');
    const $ = cheerio.load(response.body);
    var tableRowsArray = $('#content').find('.thumbnail');
    tableRowsArray.each(function (index, element) {
      var link = $(element).attr('href');

      if (link.replace('.html', '') >= 53) {
        //only articles that were published from 2010 until now
        if (
          link.includes('http://www.revistaie.ase.ro') ||
          link.includes('http://revistaie.ase.ro')
        ) {
          issuesLinks.push(link);
        } else {
          issuesLinks.push('http://www.revistaie.ase.ro/' + link);
        }
      }
    });

    for (let i = 0; i < issuesLinks.length; i++) {
      const response = await got(issuesLinks[i]);

      const $ = cheerio.load(response.body);

      var anchors = $('table').find('a');
      var headers3 = $('table').find('h3');

      var issue = '';

      headers3.each(function (index, element) {
        if ($(element).text().includes('Vol.')) {
          issue = $(element).text();
          console.log(issue);
        }
      });

      anchors.each(function (index, element) {
        var link = $(element).attr('href');
        var title = $(element).text();
        title = title.replace(/[^a-zA-Z0-9-_\. ]/g, '').trim();
        if (
          !title.includes('Inforec Association') &&
          !title.includes('Publishing Guide for Authors') &&
          !title.includes('International Conference')
        ) {
          if (
            link.includes('http://www.revistaie.ase.ro') ||
            link.includes('http://revistaie.ase.ro')
          ) {
            contentLinks.push({
              URL: link,
              title: title,
              issue: issue,
            });
          } else {
            contentLinks.push({
              URL: 'http://www.revistaie.ase.ro/' + link,
              title: title,
              issue: issue,
            });
          }
        }
      });
    }

    for (let i = 0; i < contentLinks.length; i++) {
      requestFile(contentLinks[i].URL, contentLinks[i].title);
      csvData.push({
        articleTitle: contentLinks[i].title,
        issue: contentLinks[i].issue,
        URL: contentLinks[i].URL,
      });
    }

    csvWriter.writeRecords(csvData).then(() => {
      console.log('CSV file written.');
    });
  } catch (err) {
    console.log(err.message);
  }
};

IEParser();
