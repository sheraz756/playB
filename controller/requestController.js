const RequestModel = require('../model/RequestModel');



exports.postRequestMessage = async (req, res, next) => {
    const { message } = req.body;
    console.log(message);
    if (message.length < 5) return res.status(401).send('Text must be atleast 5 characters');
    try {

        const newMessage = {
            user: req.userId,
            message
        }
        const request = await RequestModel(newMessage).save();
        const requestCreated = await RequestModel.findById(request._id).populate('user');
        return res.json(requestCreated);

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}


exports.getRequestMessages = async (req, res, next) => {
    try {
        const request = await RequestModel.find().sort({ status: 1 }).populate('user');
        return res.json(request);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}


exports.getRequestMessageById = async (req, res, next) => {
    try {
        const request = await RequestModel.findById(req.params.id).populate('user');
        if (!request) return res.status(401).json({ message: 'No Message FOund' });
        return res.status(200).json(request);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}


exports.deleteRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const request = await RequestModel.findById(id);
        if (!request) return res.status(401).send('movie not found!');
        await request.deleteOne();
        return res.status(200).send('Message deleted successfully');

    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}


exports.fullFilledRequest = async (req, res) => {

    const { _id } = req.body;
    try {
        await RequestModel.findByIdAndUpdate({ _id }, {
            status: true
        });
        return res.status(200).send('Request Fullfilled');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}