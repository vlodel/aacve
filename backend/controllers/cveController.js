const cveService = require('../services/cveService');

const getLatestCves = async (req, res) => {
  const result = await cveService.getLatest10();
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(404).send({ message: 'Cves not found' });
  }
};

const getAllCves = async (req, res) => {
  const pageNo = req.params.page;
  const resultsPerPage = 10;
  const result = await cveService.getAll(pageNo, resultsPerPage);
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(404).send({ message: 'Cves not found' });
  }
};

const getNoOfPages = async (req, res) => {
  const result = await cveService.getNoOfPages();
  if (result) {
    res.status(200).send(result.toString());
  } else {
    res.status(404).send({ message: 'Cves not found' });
  }
};

const getByKeyword = async (req, res) => {
  const result = await cveService.getByKeyword(req.query.keywords.split(','));
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(404).send({ message: 'Cves not found' });
  }
};

module.exports = { getLatestCves, getAllCves, getNoOfPages, getByKeyword };
