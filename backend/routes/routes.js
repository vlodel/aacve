const express = require('express');
const router = express.Router();

const authJwt = require('../middleware/authJwt');

const userController = require('../controllers/userController');
const cveController = require('../controllers/cveController');

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/verifyToken', authJwt.verifyToken, (req, res) => {
  res.status(201).send({ success: true });
});

router.get('/getLatestCves', cveController.getLatestCves);
router.get('/getCves/:page/:windowHeight', cveController.getAllCves);
router.get('/getNoOfPages/:windowHeight', cveController.getNoOfPages);
router.get('/getByKeywords/', cveController.getByKeyword);
router.post('/analysisSearch', cveController.analysisSearch);

module.exports = router;
