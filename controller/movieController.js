const MovieModel = require('../model/MovieModel');
const SeriesModal = require('../model/SeriesModal');





exports.getMoviesAndSeries = async (req, res, next) => {
    const { pageNumber } = req.query;
    const number = Number(pageNumber);
    const size = 1;
    try {
        let movie, series;
        if (number === 1) {
            movie = await MovieModel.find()
                .limit(size)
                .sort({ createdAt: -1 });
            series = await SeriesModal.find()
                .limit(size)
                .sort({ createdAt: -1 });

        } else {
            const skips = size * (number - 1);
            movie = await MovieModel.find()
                .skip(skips)
                .limit(size)
                .sort({ createdAt: -1 });
            series = await SeriesModal.find()
                .skip(skips)
                .limit(size)
                .sort({ createdAt: -1 });
        }
        const allContent = movie.concat(series);
        return res.status(200).json(allContent);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.countViews = async (req, res, next) => {
    const { id, view } = req.body;
    try {
        await MovieModel.findByIdAndUpdate({ _id: id }, {
            $inc: { views: view }
        });
        return res.status(200).send('View updated');
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getMovies = async (req, res, next) => {
    const { pageNumber } = req.query;
    const number = Number(pageNumber);
    const size = 8;
    try {
        let movie;
        if (number === 1) {
            movie = await MovieModel.find()
                .limit(size)
                .sort({ createdAt: -1 });

        } else {
            const skips = size * (number - 1);
            movie = await MovieModel.find()
                .skip(skips)
                .limit(size)
                .sort({ createdAt: -1 });
        }
        return res.status(200).json(movie);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getOneMovie = async (req, res, next) => {
    try {
        const movie = await MovieModel.find().limit(1).sort({ createdAt: -1 });
        return res.status(200).json(movie);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getShowCaseMovies = async (req, res, next) => {
    try {
        const movies = await MovieModel.find().limit(6).sort({ createdAt: -1 });
        if (!movies) return res.status(401).send('Not Found');
        return res.status(200).json(movies);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getMovieListByGenre = async (req, res, next) => {

    try {
        const movies = await MovieModel.find({ genre: req.params.genre }).sort({ createdAt: -1 });
        const series = await SeriesModal.find({ genre: req.params.genre }).sort({ createdAt: -1 });
        const allContent = movies.concat(series);
        return res.status(200).json(allContent);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.createMovie = async (req, res, next) => {
    const [img] = req.files.img;
    const [imgTitle] = req.files.imgTitle;
    const { title, description, year, genre, duration, trailer, video } = req.body;
    try {
        const movie = await MovieModel.findOne({ title: title.toLowerCase() });
        if (movie) return res.status(401).send('Movie Already Exisit');
        const newMovie = new MovieModel({
            title: title.toLowerCase(),
            genre: genre.toLowerCase(),
            description,
            year,
            type: 'movie',
            duration,
            imgLgPoster: img.location,
            imgSmPoster: imgTitle.location,
            video,
            trailer
        });
        if (req.files.subtitle) {
            const [subtitle] = req.files.subtitle;
            newMovie.subtitle = subtitle.location;
        }
        await newMovie.save();
        return res.status(200).send('Successfully Uploaded')
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.getMovieById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const movie = await MovieModel.findById(id);
        if (!movie) return res.status(401).send('No movie found');
        return res.status(200).json({ movie });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.getMovieByIdAndUpdate = async (req, res, next) => {
    const { id } = req.params;
    try {
        const updatedMovie = await MovieModel.findByIdAndUpdate(id, { $set: req.body.movieData }, { new: true });
        updatedMovie.save();
        return res.status(200).json({ updatedMovie });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.likeMovie = async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const { userId } = req;

        const movie = await MovieModel.findById(movieId);
        if (!movie) {
            return res.status(404).send('No Movie Found');
        }
        const isLiked = movie.likes.filter(like => like.user.toString() === userId).length > 0;
        if (isLiked) {
            return res.status(401).send('Movie already liked.');
        }

        await movie.likes.unshift({ user: userId });
        await movie.save();
        return res.status(200).send('Movie Liked');
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.unlikeMovie = async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const { userId } = req;

        const movie = await MovieModel.findById(movieId);
        if (!movie) {
            return res.status(404).send('No Movie Found');
        }

        const isLiked = movie.likes.filter(like => like.user.toString() === userId).length === 0;

        if (isLiked) {
            return res.status(401).send('Movie not liked before.');
        }

        const index = movie.likes.map(like => like.user.toString()).indexOf(userId);
        await movie.likes.splice(index, 1);
        await movie.save();

        return res.status(200).send('Movie Unliked');
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.deleteMovie = async (req, res, next) => {
    try {
        const { id } = req.params;
        const movie = await MovieModel.findById(id);
        if (!movie) return res.status(401).send('movie not found!');
        await movie.deleteOne();
        return res.status(200).send('movie deleted successfully');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}


exports.searchMovies = async (req, res, next) => {
    const { searchText } = req.params;
    try {
        const movie = await MovieModel.find({
            title: { $regex: searchText, $options: 'i' }
        });
        return res.status(200).json(movie);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

