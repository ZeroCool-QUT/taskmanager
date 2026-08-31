import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      const response = await axiosInstance.get('/api/expenses/admin/all', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setExpenses(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load claims — admin access required.');
    }
  };

  useEffect(() => {
    if (user) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleStatus = async (id, status) => {
    try {
      await axiosInstance.put(
        `/api/expenses/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update claim status.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard — All Claims</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {expenses.length === 0 && !error && <p className="text-gray-500">No claims submitted yet.</p>}
      {expenses.map((expense) => (
        <div key={expense._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold">${Number(expense.amount).toFixed(2)} — {expense.category}</h2>
              <p>{expense.description}</p>
              <p className="text-sm text-gray-500">
                Submitted by: {expense.userId?.name} ({expense.userId?.email})
              </p>
              <p className="text-sm text-gray-500">Date: {new Date(expense.date).toLocaleDateString()}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${statusStyles[expense.status] || ''}`}>
              {expense.status}
            </span>
          </div>
          {expense.status === 'pending' && (
            <div className="mt-2">
              <button
                onClick={() => handleStatus(expense._id, 'approved')}
                className="mr-2 bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatus(expense._id, 'rejected')}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
