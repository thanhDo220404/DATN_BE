// C:\Users\Bevis\Desktop\DATN_BE-develop\routes\voucher.js
const express = require('express');
const { getVouchers, addVoucher, updateVoucher, deleteVoucher, validateVoucher } = require('../mongo/voucherController');
const router = express.Router();

router.get('/', getVouchers);
router.post('/', addVoucher);
router.put('/:id', updateVoucher);
router.delete('/:id', deleteVoucher);
router.post('/validate', validateVoucher);


module.exports = router;