const FeedbackModel = require('../model/FeedbackModel');


exports.postFeedbackMessage = async (req, res, next) => {
    const { message } = req.body;
    console.log(message);
    if (message.length < 5) return res.status(401).send('Text must be atleast 5 characters');
    try {

        const newMessage = {
            user: req.userId,
            message
        }
        const feedback = await FeedbackModel(newMessage).save();
        const feedbackCreated = await FeedbackModel.findById(feedback._id).populate('user');
        return res.json(feedbackCreated);

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}


exports.getFeedbackMessages = async (req, res, next) => {
    try {
        const feedback = await FeedbackModel.find({}).sort({ status: 1 }).populate('user');
        return res.json(feedback);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}


exports.getFeedbackMessageById = async (req, res, next) => {
    try {
        const feedback = await FeedbackModel.findById(req.params.id).populate('user');
        if (!feedback) return res.status(401).json({ message: 'No Message FOund' });
        return res.status(200).json(feedback);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}

exports.deleteFeedback = async (req, res, next) => {
    try {
        const { id } = req.params;
        const feedback = await FeedbackModel.findById(id);
        if (!feedback) return res.status(401).send('movie not found!');
        await feedback.deleteOne();
        return res.status(200).send('Message deleted successfully');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}


exports.fullFilledFeedback = async (req, res) => {

    const { _id } = req.body;
    console.log(_id);
    try {
        await FeedbackModel.findByIdAndUpdate({ _id }, {
            status: true
        });
        return res.status(200).send('Feedback Fullfilled');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}