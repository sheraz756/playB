const express = require('express');
const { createDonationPost, getDonationPosts, getDonationPostById, getDonationPostByIdAndUpdate, deleteDonationPost, getDonationSize } = require('../controller/fundingController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/UploadToS3');

router.post('/', upload.single('img'), createDonationPost);
router.get('/', authMiddleware, getDonationPosts);
router.get('/getsize', getDonationSize);
router.get('/:id', authMiddleware, getDonationPostById);
router.put('/:id', authMiddleware, getDonationPostByIdAndUpdate);
router.delete('/:id', authMiddleware, deleteDonationPost);







module.exports = router;