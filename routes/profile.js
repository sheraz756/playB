const express = require('express');
const { uploadProfilePicture } = require('../controller/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/UploadToS3');
const router = express.Router();


router.post('/setProfilePicture', upload.single('media'), uploadProfilePicture);






module.exports = router