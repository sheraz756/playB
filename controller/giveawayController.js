const GiveawayModel = require('../model/GiveawayModel');


exports.getAllGiveway = async (req, res, next) => {
    try {
        const giveaway = await GiveawayModel.find().sort({ createdAt: -1 }).populate('participants.user');
        return res.status(200).json({ giveaway });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.getAllGivewayHome = async (req, res, next) => {
    try {
        const giveaway = await GiveawayModel.find().sort({ createdAt: -1 })
        return res.status(200).json(giveaway);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}




exports.getGiveawaySize = async (req, res, next) => {
    try {
        const giveaway = await GiveawayModel.find().sort({ createdAt: -1 }).populate('participants.user');
        return res.status(200).json(giveaway.length);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.createGiveaway = async (req, res, next) => {
    const { title } = req.body;
    try {
        const giveAway = await GiveawayModel.findOne({ title: title.toLowerCase() });
        if (giveAway) return res.status(401).send('Giveway Already Exisit');
        const newGiveaway = new GiveawayModel({
            title: title.toLowerCase(),
            poster: req.file.location
        });
        await newGiveaway.save();
        return res.status(200).send('Giveaway Created Successfully!')
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.getGiveawayById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const giveaway = await GiveawayModel.findById(id).populate('participants.user');
        if (!giveaway) return res.status(401).send('No giveaway found');
        return res.status(200).json({ giveaway });
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.applyForGiveaway = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userId } = req;
        const giveaway = await GiveawayModel.findById(id);
        if (!giveaway) return res.status(404).send('No Giveaway Found!');
        if (giveaway.participants.length > 0) {
            const isApplied = giveaway.participants.filter(p => p.user.toString() === userId).length > 0;
            if (isApplied) return res.status(401).send('Already Applied For This Giveaway!');
        }
        await giveaway.participants.unshift({ user: userId });
        await giveaway.save();
        return res.status(200).send('Successfully Applied!');
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}


exports.getGiveawayWinners = async (req, res, next) => {
    const { id } = req.params;
    try {
        const giveaway = await GiveawayModel.findById(id).populate('participants.user');
        if (!giveaway) return res.status(401).send('No giveaway found');
        const { participants } = giveaway;
        const shuffledParticipants = participants.sort(() => 0.5 - Math.random());
        const selectedWinners = shuffledParticipants.slice(0, 3);
        return res.status(200).json(selectedWinners);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
}

exports.deleteGiveaway = async (req, res, next) => {
    try {
        const { id } = req.params;
        const giveaway = await GiveawayModel.findById(id);
        if (!giveaway) return res.status(401).send('Giveaway not found!');
        await giveaway.deleteOne();
        return res.status(200).send('Giveaway deleted successfully');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}