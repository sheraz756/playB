const express = require('express');
const { createExploreVideos, getAllExploreVideos, deleteExploreVideo } = require('../controller/exploreController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');





router.get('/', authMiddleware, getAllExploreVideos);

router.post('/', authMiddleware, createExploreVideos);

router.delete('/:id', authMiddleware, deleteExploreVideo);

module.exports = router;