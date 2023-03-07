const SeriesModal = require('../model/SeriesModal');





exports.createSeries = async (req, res, next) => {
    const { title, description, year, genre, duration, trailer, episode } = req.body;
    const [img] = req.files.img;
    const [imgTitle] = req.files.imgTitle;
    const parseEpisodes = JSON.parse(episode);
    try {
        const series = await SeriesModal.findOne({ title: title.toLowerCase() });
        if (series) return res.status(401).send('Series Already Exisit');
        const newSeries = new SeriesModal({
            title: title.toLowerCase(),
            genre: genre.toLowerCase(),
            description,
            year,
            type: 'series',
            episodes: parseEpisodes,
            duration,
            imgLgPoster: img.location,
            imgSmPoster: imgTitle.location,
            trailer
        });
        await newSeries.save();
        return res.status(200).send('Successfully Uploaded')
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.getSeriesByIdAndUpdate = async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body.seriesData.episodes);
    try {
        const updateSeries = await SeriesModal.findByIdAndUpdate(id, { $set: req.body.seriesData }, { new: true });
        updateSeries.save();
        return res.status(200).send('updated Successfully!');
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.countViews = async (req, res, next) => {
    const { id, view } = req.body;
    try {
        await SeriesModal.findByIdAndUpdate({ _id: id }, {
            $inc: { views: view }
        });
        return res.status(200).send('View updated');
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getCurrentEpisode = async (req, res, next) => {
    const { id } = req.params;
    try {
        const series = await SeriesModal.findOne({ 'episodes._id': id }).select({ episodes: { $elemMatch: { _id: id } } });
        if (!series) return res.status(401).send('No episode found');
        return res.status(200).json(series);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}
exports.getLatestSeries = async (req, res, next) => {
    try {
        const series = await SeriesModal.find().limit(1).sort({ createdAt: -1 });
        return res.status(200).json(series);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getSeries = async (req, res, next) => {
    const { pageNumber } = req.query;
    const number = Number(pageNumber);
    const size = 8;
    try {
        let series;
        if (number === 1) {
            series = await SeriesModal.find()
                .limit(size)
                .sort({ createdAt: -1 });

        } else {
            const skips = size * (number - 1);
            series = await SeriesModal.find()
                .skip(skips)
                .limit(size)
                .sort({ createdAt: -1 });
        }
        return res.status(200).json(series);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getShowCaseSeries = async (req, res, next) => {
    try {
        const series = await SeriesModal.find().limit(6).sort({ createdAt: -1 });
        if (!series) return res.status(401).send('Not Found');
        return res.status(200).json({ series });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getSeriesListByGenre = async (req, res, next) => {
    try {
        const series = await SeriesModal.find({ genre: req.params.genre }).limit(15).sort({ createdAt: -1 });
        return res.status(200).json({ series });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getSeriesById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const series = await SeriesModal.findById(id);
        if (!series) return res.status(401).send('No series found');
        return res.status(200).json({ series });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.likeSeries = async (req, res, next) => {
    try {
        const { seriesId } = req.params;
        const { userId } = req;
        const series = await SeriesModal.findById(seriesId);
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

exports.unlikeSeries = async (req, res, next) => {
    try {
        const { seriesId } = req.params;
        const { userId } = req;

        const series = await SeriesModal.findById(seriesId);
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


exports.deleteSeries = async (req, res, next) => {
    try {
        const { id } = req.params;
        const series = await SeriesModal.findById(id);
        if (!series) return res.status(401).send('movie not found!');
        await series.deleteOne();
        return res.status(200).send('Series deleted successfully');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}
