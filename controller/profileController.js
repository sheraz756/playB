const UserModel = require('../model/UserModel');
const upload = require('../utils/UploadToS3');



exports.uploadProfilePicture = (req, res, next) => {
    const { id } = req.body;

    const uploadSingle = upload.single('media');

    uploadSingle(req, res, async (err) => {
        if (err) return res.status(400).json({ message: err.message });

        await UserModel.findByIdAndUpdate({ _id: id }, {
            profilePicture: req.file.location
        })
    });

    return res.status(200).send('Successfully Updated ProfilePicture');



}