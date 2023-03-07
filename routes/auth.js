const express = require('express');
const { getAuth, loginUser, getAdminAuth, adminLogin, renewVoucherAccount, renewCardAccount, upgradePlan, getUserStats, getNewUsers, getAllStatsForDashboard, changePassword, changeUsername, logoutUser, getUserByCity } = require('../controller/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');



router.get('/', authMiddleware, getAuth);
router.get('/isAdmin', authMiddleware, getAdminAuth);
router.post('/', loginUser);
router.post('/logout', logoutUser);
router.post('/adminLogin', adminLogin)
router.post('/renew/voucher', authMiddleware, renewVoucherAccount);
router.post('/renew/card', authMiddleware, renewCardAccount);
router.post('/upgradeplan', authMiddleware, upgradePlan);
router.post('/settings/password', authMiddleware, changePassword);
router.post('/settings/username', authMiddleware, changeUsername)

router.get('/userstats', getUserStats);
router.get('/userbycity', getUserByCity);
router.get('/newusers', getNewUsers);
router.get('/dashboardstats', getAllStatsForDashboard);

module.exports = router;