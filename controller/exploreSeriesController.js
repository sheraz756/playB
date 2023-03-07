const ExploreSeriesModel = require('../model/ExploreSeries');






exports.likeShortSeries = async (req, res, next) => {
    try {
        const { seriesId } = req.params;
        const { userId } = req;
        const series = await ExploreSeriesModel.findById(seriesId);
        if (!series) {
            return res.status(404).send('No series Found');
        }
        const isLiked = series.likes.filter(like => like.user.toString() === userId).length > 0;
        if (isLiked) {
            return res.status(401).send('series already liked.');
        }

        await series.likes.unshift({ user: userId });
        await series.save();
        return res.status(200).send('series Liked');
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.unlikeShortSeries = async (req, res, next) => {
    try {
        const { seriesId } = req.params;
        const { userId } = req;

        const series = await ExploreSeriesModel.findById(seriesId);
        if (!series) {
            return res.status(404).send('No series Found');
        }

        const isLiked = series.likes.filter(like => like.user.toString() === userId).length === 0;

        if (isLiked) {
            return res.status(401).send('series not liked before.');
        }

        const index = series.likes.map(like => like.user.toString()).indexOf(userId);
        await series.likes.splice(index, 1);
        await series.save();

        return res.status(200).send('series Unliked');
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}