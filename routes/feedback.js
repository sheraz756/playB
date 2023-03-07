const express = require('express');
const { getFeedbackMessages, postFeedbackMessage, getFeedbackMessageById, deleteFeedback, fullFilledFeedback } = require('../controller/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();




router.get('/', getFeedbackMessages);
router.get('/:id', authMiddleware, getFeedbackMessageById);
router.post('/', authMiddleware, postFeedbackMessage);
router.post('/fullfilled', authMiddleware, fullFilledFeedback);
router.delete('/:id', deleteFeedback);






module.exports = router