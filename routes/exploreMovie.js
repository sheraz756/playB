const express = require('express');
const { likeMovieShort, unlikeMovieShort } = require('../controller/exploreMovieController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


router.post('/like/:movieId', authMiddleware, likeMovieShort);
router.post('/unlike/:movieId', authMiddleware, unlikeMovieShort);


module.exports = router;