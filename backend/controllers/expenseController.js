
const Expense = require('../models/Expense');

// @desc    Get the logged-in user's own expense claims
// @route   GET /api/expenses
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new expense claim, owned by the logged-in user
// @route   POST /api/expenses
const addExpense = async (req, res) => {
    const { amount, category, date, description } = req.body;

    if (amount === undefined || amount === null || Number(amount) <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than 0' });
    }
    if (!category) {
        return res.status(400).json({ message: 'Category is required' });
    }
    if (!date) {
        return res.status(400).json({ message: 'Date is required' });
    }

    try {
        const expense = await Expense.create({
            userId: req.user.id,
            amount,
            category,
            date,
            description,
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an expense claim — owner only, while still pending
// @route   PUT /api/expenses/:id
const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        if (expense.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this claim' });
        }
        if (expense.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending claims can be edited' });
        }

        const { amount, category, date, description } = req.body;
        if (amount !== undefined && Number(amount) <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }

        expense.amount = amount ?? expense.amount;
        expense.category = category ?? expense.category;
        expense.date = date ?? expense.date;
        expense.description = description ?? expense.description;

        const updated = await expense.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an expense claim — owner only
// @route   DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        if (expense.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this claim' });
        }

        await expense.deleteOne();
        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getExpenses, addExpense, updateExpense, deleteExpense };
