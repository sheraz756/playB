const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const MovieModel = require('../model/MovieModel');
const SeriesModal = require('../model/SeriesModal');


router.get('/:searchText', authMiddleware, async (req, res) => {
    const { searchText } = req.params;
    try {
        let movies, series;
        movies = await MovieModel.find({
            title: { $regex: searchText, $options: 'i' }
        });
        series = await SeriesModal.find({
            title: { $regex: searchText, $options: 'i' }
        });
        const allContent = movies.concat(series);
        return res.status(200).json(allContent);

    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
});


router.get('/results/:searchText', authMiddleware, async (req, res) => {
    const { searchText } = req.params;
    try {

        const movieResults = await MovieModel.find({
            title: { $regex: searchText, $options: 'i' }
        });
        const seriesResult = await SeriesModal.find({
            title: { $regex: searchText, $options: 'i' }
        });
        return res.status(200).json({
            movies: movieResults,
            series: seriesResult
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
});





module.exports = router