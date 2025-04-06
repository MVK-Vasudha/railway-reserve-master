
const express = require('express');
const router = express.Router();
const { 
  createPayment, 
  getPayments, 
  getUserPayments 
} = require('../controllers/payment.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All payment routes need authentication

router.route('/')
  .post(createPayment)
  .get(authorize('admin'), getPayments);

router.get('/my-payments', getUserPayments);

module.exports = router;
