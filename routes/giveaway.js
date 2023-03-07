const express = require('express');
const { getAllGiveway, createGiveaway, getGiveawayById, applyForGiveaway, getGiveawayWinners, deleteGiveaway,getGiveawaySize, getAllGivewayHome } = require('../controller/giveawayController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const upload = require('../utils/UploadToS3');


router.post('/', upload.single('img'), createGiveaway);
router.get('/', getAllGiveway);
router.get('/all', getAllGivewayHome);
router.get('/getsize', getGiveawaySize);
router.get('/:id', authMiddleware, getGiveawayById);
router.get('/getwinners/:id', getGiveawayWinners);
router.post('/:id', authMiddleware, applyForGiveaway);

router.delete('/:id', authMiddleware, deleteGiveaway);





module.exports = router