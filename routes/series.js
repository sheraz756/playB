const express = require('express');
const { createSeries, getSeries, deleteSeries, getSeriesListByGenre, getShowCaseSeries, getLatestSeries, getSeriesById, likeSeries, unlikeSeries, getCurrentEpisode, countViews, getSeriesByIdAndUpdate } = require('../controller/seriesController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/UploadToS3');


router.get('/', authMiddleware, getSeries);
router.get('/latest', getLatestSeries);
router.get('/list/:genre', getSeriesListByGenre);
router.get('/showcase', getShowCaseSeries);
router.get('/episode/:id', authMiddleware, getCurrentEpisode);

router.get('/:id', authMiddleware, getSeriesById);
router.put('/:id', authMiddleware, getSeriesByIdAndUpdate)

router.post('/like/:seriesId', authMiddleware, likeSeries);
router.post('/unlike/:seriesId', authMiddleware, unlikeSeries);
router.post('/countviews', countViews);
router.post('/', upload.fields([
    { name: "img", maxCount: 1 },
    { name: "imgTitle", maxCount: 1 }
]), createSeries);
router.delete('/:id', authMiddleware, deleteSeries)


module.exports = router;