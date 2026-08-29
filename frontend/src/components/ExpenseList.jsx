import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const ExpenseList = ({ expenses, setExpenses, setEditingExpense }) => {
  const { user } = useAuth();

  const handleDelete = async (expenseId) => {
    try {
      await axiosInstance.delete(`/api/expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setExpenses(expenses.filter((exp) => exp._id !== expenseId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete expense claim.');
    }
  };

  if (expenses.length === 0) {
    return <p className="text-gray-500">You haven't submitted any expense claims yet.</p>;
  }

  return (
    <div>
      {expenses.map((expense) => (
        <div key={expense._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold">${Number(expense.amount).toFixed(2)} — {expense.category}</h2>
              <p>{expense.description}</p>
              <p className="text-sm text-gray-500">Date: {new Date(expense.date).toLocaleDateString()}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${statusStyles[expense.status] || ''}`}>
              {expense.status}
            </span>
          </div>
          {expense.status === 'pending' && (
            <div className="mt-2">
              <button
                onClick={() => setEditingExpense(expense)}
                className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(expense._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
