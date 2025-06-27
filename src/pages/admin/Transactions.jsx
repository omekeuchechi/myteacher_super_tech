import React, { useState, useEffect, useContext } from 'react';
import Pusher from 'pusher-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNav from "../../components/adminCom/navSection";
import { AuthContext } from '../../../context/Authcontext';
import '../../assets/styles/admin/transaction.css';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const Transactions = () => {
  const { logout } = useContext(AuthContext);
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/admin/ui-settings", label: "UI Settings" },
    { to: "/admin/take-lecture", label: "Take Lecture" },
    { to: "/admin/profile", label: "Profile" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/transactions", label: "Transactions" },
    { to: "/admin/enrollments", label: "Enrollment" },
    { to: "/admin/admin-list", label: "Admin List" },
    { to: "/admin/contact-messages", label: "Contact Messages" },
    { to: "/admin/publish-asset", label: "Publish Asset" },
    { to: "/admin/post-blog", label: "Post Blog" },
  ];
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
    return (
      <div className="loading-state">
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <div className="error-state">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="pagination-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <AdminNav navLinks={navLinks} onLogout={logout} />
      <div className="transactions-container">
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
        
        <header className="transactions-header">
          <h2>All Transactions</h2>
        </header>

        {transactions.length === 0 && !loading ? (
          <div className="empty-state">
            <p>No transactions found.</p>
          </div>
        ) : (
          <>
            <div className="transaction-list">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="transaction-card">
                  <img 
                    src={transaction.user?.avatar || 'https://via.placeholder.com/50'} 
                    alt={transaction.user?.name || 'User'} 
                    className="transaction-avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/50';
                    }}
                  />
                  <div className="transaction-content">
                    <div className="transaction-row">
                      <span className="transaction-label">User:</span>
                      <span className="transaction-value">{transaction.user?.name || 'N/A'}</span>
                    </div>
                    <div className="transaction-row">
                      <span className="transaction-label">Email:</span>
                      <span className="transaction-value">{transaction.user?.email || 'N/A'}</span>
                    </div>
                    <div className="transaction-row">
                      <span className="transaction-label">Course:</span>
                      <span className="transaction-value">{transaction.course?.course || 'N/A'}</span>
                    </div>
                    <div className="transaction-row">
                      <span className="transaction-label">Price:</span>
                      <span className="transaction-value transaction-price">
                        {transaction.course?.price ? `₦${transaction.course.price}` : 'N/A'}
                      </span>
                    </div>
                    <div className="transaction-row">
                      <span className="transaction-label">Date:</span>
                      <span className="transaction-value">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button 
                onClick={handlePrevPage} 
                disabled={!pagination.hasPreviousPage}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.currentPage || 1} of {pagination.totalPages || 1}
              </span>
              <button 
                onClick={handleNextPage} 
                disabled={!pagination.hasNextPage}
                className="pagination-button"
              >
                Next
              </button>
            </div>
            
            <p className="pagination-total">
              Total transactions: {pagination.totalItems || 0}
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default Transactions;