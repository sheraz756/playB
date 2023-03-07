const express = require('express');
const { createVouchers, getVouchers, deleteVoucher, getGoldVouchers, createGoldVouchers, searchVouchers, getVoucherById, createCustomGoldVoucher, getVouchersForExcel, getGoldVouchersForExcel } = require('../controller/voucherController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();



router.post('/', authMiddleware, createVouchers);
router.get('/', authMiddleware, getVouchers);
router.get('/excel', authMiddleware, getVouchersForExcel);
router.get('/gold/excel', authMiddleware, getGoldVouchersForExcel);
router.get('/search/:searchText', authMiddleware, searchVouchers);
router.get('/:id', authMiddleware, getVoucherById);
router.get('/get/gold', getGoldVouchers);
router.post('/gold', authMiddleware, createGoldVouchers);
router.post('/gold/custom', authMiddleware, createCustomGoldVoucher)
router.delete('/:id', authMiddleware, deleteVoucher);





module.exports = router