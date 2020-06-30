const fileService = require('../services/fileService');

const analyzeFile = async (req, res) => {
  const result = await fileService.analyzeFile(req.file);
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(404).send({ message: 'File analyzer not successful' });
  }
};

module.exports = { analyzeFile };
