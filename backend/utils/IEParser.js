const http = require('http');
const cheerio = require('cheerio');
const got = require('got');
const fs = require('fs');
const path = require('path');

const requestFile = async (URL, fileName) => {
  http.get(URL, (response) => {
    const file = fs.createWriteStream(
      path.join(__dirname, './revistaIE') + '/' + fileName + '.pdf'
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
            });
          } else {
            contentLinks.push({
              URL: 'http://www.revistaie.ase.ro/' + link,
              title: title,
            });
          }
        }
      });
    }

    for (let i = 0; i < contentLinks.length; i++) {
      requestFile(contentLinks[i].URL, contentLinks[i].title);
    }
  } catch (err) {
    console.log(err.message);
  }
};

IEParser();
