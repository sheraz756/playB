const express = require('express');
const { liveStreamer } = require('../controller/IdController');
const { getAllUsers, deleteUser, getAllUsersWithNextPaymentDateEqualsToday, getOldAndNewUsers, createAdmin, getStats, getUserByCategory, getUserByDates, getUserByName } = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// getAllUsers
router.get('/', authMiddleware, getAllUsers);

router.post('/liveStream',liveStreamer)
// getAllUsers with card paymentMethod and nextpaymentDate === today 
router.get('/cardnextpayment', getAllUsersWithNextPaymentDateEqualsToday)

// Deleteauser
router.delete('/:id', authMiddleware, deleteUser);


// getOld and new users
router.get('/oldnewusers', getOldAndNewUsers);


// get stats
router.get('/stats', getStats)

// get by category
router.get('/category/:type', getUserByCategory);
router.get('/:text', getUserByName);
router.post('/date', getUserByDates);

router.post('/admin', createAdmin)

module.exports = router