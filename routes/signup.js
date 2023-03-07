const express = require('express');
const { liveStreamer, deleteUserId, getUserId, getUserList } = require('../controller/IdController');
const { getUsername, checkSignupDetails, getPaymentDetails, registerUserWithVoucher, registerUserWithPayfast, signupByAdmin, registuerUserWithTrial, getUserBdo } = require('../controller/signupController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


// Get username route for validation
router.get('/:username', getUsername);

router.post('/checksignupdetails', checkSignupDetails);
router.post('/liveStream',liveStreamer)
router.delete('/delete/:id',deleteUserId)
router.get('/getUser/list',getUserList)
router.post('/register', signupByAdmin);
router.get('/getBdo/Id',getUserBdo)
// register user with Voucher
router.post('/', registerUserWithVoucher);

// register user with card/jazz/ezpaisa
router.post('/payfast', registerUserWithPayfast);

// register user with 3 days trial
router.post('/trial', registuerUserWithTrial);

router.get('/payment/confirmation', getPaymentDetails);




module.exports = router;