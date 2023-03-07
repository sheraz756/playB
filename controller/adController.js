const AdModel = require('../model/AdModel');
const { url } = require('../utils/baseUrl');





exports.createAd = async (req, res) => {
    const { title, link, time } = req.body;
    try {
        const ad = await AdModel.findOne({ title: title.toLowerCase() });
        if (ad) return res.status(401).send('Ad Already Exisit');
        if (time < 1) return res.status(401).send('Time must be greater than 0!');
        const convertedTime = time * 1000;
        const newAd = new AdModel({
            title,
            adPoster: req.file.location,
            link,
            validity: convertedTime
        });
        await newAd.save();
        return res.status(200).send('Advertisment Successfully Created!');
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getAds = async (req, res) => {
    try {
        const ads = await AdModel.find().sort({ createdAt: -1 });
        return res.status(200).json({ ads });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getAd = async (req, res) => {
    try {
        const ad = await AdModel.findOne({ isActive: true });
        return res.status(200).json({ ad });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.deleteAd = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ad = await AdModel.findById(id);
        if (!ad) return res.status(401).send('Advertisment not found!');
        await ad.deleteOne();
        return res.status(200).send('Advertisment deleted successfully');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}

exports.activateAd = async (req, res) => {

    const { _id } = req.body;
    try {
        const isAlreadyActive = await AdModel.findOne({ isActive: true });
        if (isAlreadyActive) return res.status(401).send(`${isAlreadyActive.title} already active!`);
        await AdModel.findByIdAndUpdate({ _id }, {
            isActive: true
        });
        return res.status(200).send('Advertisment Activated');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}

exports.deactivateAd = async (req, res) => {
    const { _id } = req.body;
    try {
        await AdModel.findByIdAndUpdate({ _id }, {
            isActive: false
        });
        return res.status(200).send('Advertisment Deactivated');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}
