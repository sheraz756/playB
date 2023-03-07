const ExploreMovieModel = require('../model/ExploreMovie');










exports.likeMovieShort = async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const { userId } = req;

        const movie = await ExploreMovieModel.findById(movieId);
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

exports.unlikeMovieShort = async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const { userId } = req;

        const movie = await ExploreMovieModel.findById(movieId);
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