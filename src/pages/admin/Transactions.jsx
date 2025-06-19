import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/transaction/all-transactions?page=${page}&limit=10`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to fetch transactions');
        }
        
        setTransactions(data.data);
        setPagination(data.pagination);

      } catch (err) {
        setError(err.message);
        toast.error(err.message || 'Failed to fetch transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page, refetch]);

  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      useTLS: true
    });

    const channel = pusher.subscribe('admin-dashboard');
    channel.bind('new-transaction', (data) => {
      console.log('New transaction received:', data);
      toast.info(`A new transaction of ${data.amount} was just made!`);
      setRefetch(prev => prev + 1);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe('admin-dashboard');
      pusher.disconnect();
    };
  }, []);

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
        setPage((prevPage) => prevPage + 1);
    }
  };

  if (loading && transactions.length === 0) {
    return <div>Loading...</div>;
  }

  if (error && transactions.length === 0) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h2>All Transactions</h2>
      {transactions.length === 0 && !loading ? (
        <p>No transactions found.</p>
      ) : (
        <>
          <div style={{ padding: '1rem' }}>
            {transactions.map((transaction) => (
              <div key={transaction._id} style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                <img src={transaction.user?.avatar || 'https://via.placeholder.com/50'} alt={transaction.user?.name} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '1rem' }} />
                <div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>User:</strong> <span>{transaction.user?.name || 'N/A'}</span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Email:</strong> <span>{transaction.user?.email || 'N/A'}</span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Course:</strong> <span>{transaction.course?.course || 'N/A'}</span>
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Price:</strong> <span>{transaction.course ? `$${transaction.course.price}` : 'N/A'}</span>
                  </div>
                  <div>
                    <strong>Date:</strong> <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button onClick={handlePrevPage} disabled={!pagination.hasPreviousPage} style={{ marginRight: '0.5rem' }}>
              Previous
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button onClick={handleNextPage} disabled={!pagination.hasNextPage} style={{ marginLeft: '0.5rem' }}>
              Next
            </button>
          </div>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>Total transactions: {pagination.totalItems}</p>
        </>
      )}
    </div>
  );
};

export default Transactions;