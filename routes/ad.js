const express = require('express');
const { createAd, getAd, deleteAd, getAds, activateAd, deactivateAd } = require('../controller/adController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/UploadToS3');



router.post('/', upload.single('img'), createAd);
router.post('/activate', activateAd);
router.post('/deactivate', deactivateAd);
router.get('/', authMiddleware, getAd);
router.get('/all', getAds);
router.delete('/:id', authMiddleware, deleteAd);



module.exports = router;