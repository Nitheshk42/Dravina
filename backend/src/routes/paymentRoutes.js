const express = require('express');
const router = express.Router();
const { createPaymentIntent, handleWebhook, confirmPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Create payment intent — protected
router.post('/create-intent', protect, createPaymentIntent);

// Confirm payment — protected
router.post('/confirm', protect, confirmPayment);

// Webhook — NOT protected (Stripe calls this directly)
router.post('/webhook', handleWebhook);

module.exports = router;