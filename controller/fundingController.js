const FundingModel = require('../model/FundingModel');
const { url } = require('../utils/baseUrl');



exports.createDonationPost = async (req, res, next) => {
    const { title, description, ammount } = req.body;
    try {
        const donation = await FundingModel.findOne({ title: title.toLowerCase() });
        if (donation) return res.status(401).send('Donation Post Already Exisit');
        const newDonation = new FundingModel({
            title: title.toLowerCase(),
            description,
            ammount,
            img: req.file.location
        });
        await newDonation.save();
        return res.status(200).send('Donation Post Successfully Created!')
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}




exports.getDonationPosts = async (req, res, next) => {
    try {
        const donations = await FundingModel.find().sort({ createdAt: -1 });
        return res.status(200).json({ donations });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getDonationSize = async (req, res, next) => {
    try {
        const donations = await FundingModel.find().sort({ createdAt: -1 });
        return res.status(200).json(donations.length);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.getDonationPostById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const donation = await FundingModel.findById(id);
        if (!donation) return res.status(401).send('No donation post found');
        return res.status(200).json({ donation });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.getDonationPostByIdAndUpdate = async (req, res, next) => {
    const { id } = req.params;
    try {
        const updatedPost = await FundingModel.findByIdAndUpdate(id, { $set: req.body.donationData }, { new: true });
        updatedPost.save();
        return res.status(200).json({ updatedPost });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.deleteDonationPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const donation = await FundingModel.findById(id);
        if (!donation) return res.status(401).send('Donation post not found!');
        await donation.deleteOne();
        return res.status(200).send('Donation deleted successfully');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}





