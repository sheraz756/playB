const ExploreMovieModel = require('../model/ExploreMovie');
const ExploreSeriesModel = require('../model/ExploreSeries');
const MovieModel = require('../model/MovieModel');
const SeriesModel = require('../model/SeriesModal');





exports.getAllExploreVideos = async (req, res, next) => {
    const { pageNumber } = req.query;
    const number = Number(pageNumber);
    const size = 1;
    try {
        let moviesShort, seriesShort;

        if (number === 1) {
            moviesShort = await ExploreMovieModel.find()
                .limit(size)
                .sort({ createdAt: -1 })
                .populate('movie');
            seriesShort = await ExploreSeriesModel.find()
                .limit(size)
                .sort({ createdAt: -1 })
                .populate('series');
        } else {
            const skips = size * (number - 1);
            moviesShort = await ExploreMovieModel.find()
                .skip(skips)
                .limit(size)
                .sort({ createdAt: -1 })
                .populate('movie');
            seriesShort = await ExploreSeriesModel.find()
                .skip(skips)
                .limit(size)
                .sort({ createdAt: -1 })
                .populate('series');
        }
        const allContent = [...moviesShort, ...seriesShort];
        const sortedContent = allContent.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return res.status(200).send(sortedContent);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}





exports.createExploreVideos = async (req, res, next) => {
    const { nameTxt, shortVideo } = req.body.data;
    try {
        const isMovie = await MovieModel.findOne({ title: nameTxt.toLowerCase() });
        const isSeries = await SeriesModel.findOne({ title: nameTxt.toLowerCase() });
        if (!isMovie && !isSeries) return res.status(404).send('Not Found');
        if (isMovie) {
            const newExploreShortMovie = new ExploreMovieModel({
                movie: isMovie._id,
                shortVideo
            });
            await newExploreShortMovie.save();
            return res.status(200).send('Successfully Uploaded')
        }
        else {
            const newExploreShortSeries = new ExploreSeriesModel({
                series: isSeries._id,
                shortVideo
            });
            await newExploreShortSeries.save();
            return res.status(200).send('Successfully Uploaded')
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}




exports.deleteExploreVideo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const movie = await ExploreMovieModel.findById(id);
        const series = await ExploreSeriesModel.findById(id);
        if (!movie && !series) return res.status(401).send('No Content Found!');

        if (movie) {
            await movie.deleteOne();
            return res.status(200).send('Short deleted successfully');
        } else {
            await series.deleteOne();
            return res.status(200).send('Short deleted successfully');
        }


    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}