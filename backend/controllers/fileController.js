const fileService = require('../services/fileService');

const analyzeFile = async (req, res) => {
  if (req.file) {
    const result = await fileService.analyzeFile(req.file);
    console.log(result);

    if (result && Object.keys(result).length !== 0) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: 'File analyzer not successful' });
    }
  } else {
    res.status(400).send({ message: 'Invalid file' });
  }
};

module.exports = { analyzeFile };
