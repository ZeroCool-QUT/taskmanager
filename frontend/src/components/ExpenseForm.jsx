import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ExpenseForm = ({ expenses, setExpenses, editingExpense, setEditingExpense }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ amount: '', category: '', date: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: editingExpense.date ? editingExpense.date.substring(0, 10) : '',
        description: editingExpense.description || '',
      });
    } else {
      setFormData({ amount: '', category: '', date: '', description: '' });
    }
  }, [editingExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    if (!formData.category) {
      setError('Category is required.');
      return;
    }
    if (!formData.date) {
      setError('Date is required.');
      return;
    }

    try {
      if (editingExpense) {
        const response = await axiosInstance.put(`/api/expenses/${editingExpense._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setExpenses(expenses.map((exp) => (exp._id === response.data._id ? response.data : exp)));
      } else {
        const response = await axiosInstance.post('/api/expenses', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setExpenses([...expenses, response.data]);
      }
      setEditingExpense(null);
      setFormData({ amount: '', category: '', date: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expense claim.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingExpense ? 'Edit Expense Claim' : 'Add Expense Claim'}</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Category (e.g. Travel, Meals, Accommodation)"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingExpense ? 'Update Claim' : 'Submit Claim'}
      </button>
    </form>
  );
};

export default ExpenseForm;
