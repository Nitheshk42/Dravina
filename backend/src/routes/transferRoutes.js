const express = require('express');
const router = express.Router();
const { sendMoney, getHistory, getBalance, getLimits } = require('../controllers/transferController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/transfer/send:
 *   post:
 *     summary: Send money internationally
 *     tags: [Transfer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amountSent:
 *                 type: number
 *                 example: 100
 *               amountReceived:
 *                 type: number
 *                 example: 8312.50
 *               currency:
 *                 type: string
 *                 example: INR
 *               country:
 *                 type: string
 *                 example: India
 *               exchangeRate:
 *                 type: number
 *                 example: 83.12
 *     responses:
 *       201:
 *         description: Transfer successful
 *       400:
 *         description: Insufficient balance
 *       401:
 *         description: Unauthorized - No token
 */
router.post('/send', protect, sendMoney);

/**
 * @swagger
 * /api/transfer/history:
 *   get:
 *     summary: Get transaction history
 *     tags: [Transfer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all transactions
 *       401:
 *         description: Unauthorized - No token
 */
router.get('/history', protect, getHistory);

/**
 * @swagger
 * /api/transfer/balance:
 *   get:
 *     summary: Get user balance
 *     tags: [Transfer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User balance and info
 *       401:
 *         description: Unauthorized - No token
 */
router.get('/balance', protect, getBalance);

router.get('/limits', protect, getLimits);

module.exports = router;