const express = require('express');
const { likeShortSeries, unlikeShortSeries } = require('../controller/exploreSeriesController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');





router.post('/like/:seriesId', authMiddleware, likeShortSeries);
router.post('/unlike/:seriesId', authMiddleware, unlikeShortSeries);



module.exports = router;