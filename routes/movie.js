const express = require('express');
const { getMovies, createMovie, getMovieById, getMovieByIdAndUpdate, deleteMovie, getMovieList, getShowCaseMovies, getMovieListByGenre, getOneMovie, likeMovie, unlikeMovie, countViews, getMoviesAndSeries, searchMovies } = require('../controller/movieController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/UploadToS3');



router.get('/moviesnseries', getMoviesAndSeries);
router.get('/', authMiddleware, getMovies);
router.get('/list/:genre', getMovieListByGenre);

router.get('/latest', getOneMovie);
router.get('/showcase', getShowCaseMovies);
router.get('/:id', authMiddleware, getMovieById)
router.put('/:id', authMiddleware, getMovieByIdAndUpdate);

router.get('/:searchText', authMiddleware, searchMovies)


router.post('/like/:movieId', authMiddleware, likeMovie);
router.post('/unlike/:movieId', authMiddleware, unlikeMovie);
router.post('/countviews', countViews);
router.post('/', upload.fields([
    { name: "img", maxCount: 1 },
    { name: "imgTitle", maxCount: 1 },
    { name: "subtitle", maxCount: 1 }
]), createMovie);

router.delete('/:id', authMiddleware, deleteMovie);



module.exports = router;