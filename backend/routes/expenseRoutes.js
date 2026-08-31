const express = require('express');
const { getExpenses, addExpense, updateExpense, deleteExpense, getAllExpenses, updateExpenseStatus } = require('../controllers/expenseController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/admin/all', protect, adminOnly, getAllExpenses);
router.put('/:id/status', protect, adminOnly, updateExpenseStatus);
router.route('/').get(protect, getExpenses).post(protect, addExpense);
router.route('/:id').put(protect, updateExpense).delete(protect, deleteExpense);

module.exports = router;