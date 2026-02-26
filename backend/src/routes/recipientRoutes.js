const express = require('express');
const router = express.Router();
const { addRecipient, getRecipients, updateRecipient, deleteRecipient } = require('../controllers/recipientController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addRecipient);
router.get('/list', protect, getRecipients);
router.put('/:id', protect, updateRecipient);
router.delete('/:id', protect, deleteRecipient);

module.exports = router;