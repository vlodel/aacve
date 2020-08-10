const express = require('express');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const authJwt = require('../middleware/authJwt');

const userController = require('../controllers/userController');
const cveController = require('../controllers/cveController');
const fileController = require('../controllers/fileController');

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
router.post(
  '/fileUpload',
  upload.single('document'),
  fileController.analyzeFile
);

module.exports = router;
