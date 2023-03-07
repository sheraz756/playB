const express = require('express');
const { getRequestMessages, postRequestMessage, getRequestMessageById, deleteRequest, fullFilledRequest } = require('../controller/requestController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();



router.get('/', getRequestMessages);
router.get('/:id', authMiddleware, getRequestMessageById);
router.post('/', authMiddleware, postRequestMessage);
router.post('/fullfilled', authMiddleware, fullFilledRequest);
router.delete('/:id', deleteRequest);







module.exports = router