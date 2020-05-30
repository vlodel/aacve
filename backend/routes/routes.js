const express = require('express');
const router = express.Router();

const authJwt = require('../middleware/authJwt');

const userController = require('../controllers/userController');
const cveController = require('../controllers/cveController');

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

//probably won't use
router.get('/getLatestCves', cveController.getLatestCves);

router.get('/getCves/:page', cveController.getAllCves);
router.get('/getNoOfPages', cveController.getNoOfPages);
router.get('/getByKeywords/', cveController.getByKeyword);
router.get('/analysisSearch', cveController.analysisSearch);

router.post('/verifyToken', authJwt.verifyToken, (req, res) => {
  res.status(201).send({ success: true });
});

module.exports = router;
