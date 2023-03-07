const express = require('express');
const { getAllStaff, registerStaff, getStaffById, updateStaffById, changeStaffPassword } = require('../controller/staffController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();



// get all staff
router.get('/', authMiddleware, getAllStaff);

// get staff by id
router.get('/:id', authMiddleware, getStaffById);

// update staff by id
router.put('/:id', updateStaffById);

// register staff memeber
router.post('/', registerStaff)


// change staff password
router.post('/update', authMiddleware, changeStaffPassword)




module.exports = router