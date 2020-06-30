//node .\dictionaryProvider.js

const cheerio = require('cheerio');
const got = require('got');
const fs = require('fs');

const dictionaryProvider = async () => {
  const html = await got(
    'https://csrc.nist.gov/glossary?sortBy-lg=relevance&ipp-lg=all'
  );
  const $ = cheerio.load(html.body);

  const listItems = $('#results-container').find('.term-list-item');
  listItems.each(function (index, element) {
    const anchor = $(element).find('a');
    const anchorText = anchor.text();
    fs.appendFileSync('dictionary.txt', anchorText + '\n');
  });
};

dictionaryProvider();
