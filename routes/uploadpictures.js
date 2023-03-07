const express = require('express');
// const upload = require('../utils/UploadToS3');
const router = express.Router();
const multer = require('multer');
const { url } = require('../utils/baseUrl');
const up = multer();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage }).single('media');


router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).send('Server Error');
        }
        res.status(200).json({ data: req.file });
    })
});



module.exports = router;







// const uploadSingle = upload.single('media');

//     uploadSingle(req, res, async (err) => {
//         if (err) return res.status(400).json({ message: err.message });
//         return res.status(200).json({ location: req.file.location });
//     });