import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/Authcontext';
import AdminNav from '../../components/adminCom/navSection';
import '../../assets/styles/admin/dashboard.css';

const API_BASE = import.meta.env.VITE_BASEURL || 'http://localhost:5000/api/v1';

const navLinks = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/admin/ui-settings', label: 'UI Settings', icon: 'sliders-h' },
  { to: '/admin/take-lecture', label: 'Take Lecture', icon: 'chalkboard-teacher' },
  { to: '/admin/profile', label: 'Profile', icon: 'user' },
  { to: '/admin/users', label: 'Users', icon: 'users' },
  { to: '/admin/transactions', label: 'Transactions', icon: 'receipt' },
  { to: '/admin/enrollments', label: 'Enrollment', icon: 'user-graduate' },
  { to: '/admin/admin-list', label: 'Admin List', icon: 'user-shield' },
  { to: '/admin/contact-messages', label: 'Contact Messages', icon: 'envelope' },
  { to: '/admin/publish-asset', label: 'Publish Asset', icon: 'upload' },
  { to: '/admin/post-blog', label: 'Post Blog', icon: 'blog' },
  { to: '/admin/mailer', label: 'Email Manager', icon: 'envelope-open-text' }
];

const TabPanel = ({ children, value, index }) => {
  return value === index ? <div className="p-3">{children}</div> : null;
};

const Mailer = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [emailHistory, setEmailHistory] = useState([]);
  const [totalEmails, setTotalEmails] = useState(0);
  const [useHtml, setUseHtml] = useState(false);
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Failed to fetch users', 'danger');
    }
  }, [token]);

  const fetchEmailHistory = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE}/mailer/history?page=${page + 1}&limit=${rowsPerPage}`,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch email history');
      
      const data = await response.json();
      setEmailHistory(data.mails || []);
      setTotalEmails(data.totalPages * rowsPerPage || 0);
    } catch (error) {
      console.error('Error fetching email history:', error);
      showSnackbar('Failed to fetch email history', 'danger');
    }
  }, [token, page, rowsPerPage]);

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchEmailHistory();
    } else {
      navigate('/login');
    }
  }, [token, page, rowsPerPage, fetchUsers, fetchEmailHistory, navigate]);

  const handleSendEmail = async () => {
    if (!subject || !message) {
      showSnackbar('Subject and message are required', 'danger');
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      const data = { subject };
      
      if (useHtml) {
        data.html = message;
      } else {
        data.text = message;
      }

      switch (activeTab) {
        case 0: // All users
          endpoint = '/send-to-all';
          break;
        case 1: // Specific user
          if (!selectedUser) {
            showSnackbar('Please select a user', 'danger');
            setLoading(false);
            return;
          }
          endpoint = `/send-to-user/${selectedUser}`;
          break;
        case 2: // All admins
          endpoint = '/send-to-admins';
          break;
        case 3: // Specific admin
          if (!selectedUser) {
            showSnackbar('Please select an admin', 'danger');
            setLoading(false);
            return;
          }
          endpoint = `/send-to-admin/${selectedUser}`;
          break;
        default:
          break;
      }

      const response = await fetch(`${API_BASE}/mailer${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to send email');

      showSnackbar('Email sent successfully!', 'success');
      setSubject('');
      setMessage('');
      fetchEmailHistory();
    } catch (error) {
      console.error('Error sending email:', error);
      showSnackbar('Failed to send email', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar(prev => ({ ...prev, open: false })), 5000);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (activeTab === 1) return true; // All users tab
      if (activeTab === 3) return user.isAdmin || user.isSuperAdmin; // Admins tab
      return true;
    });
  }, [users, activeTab]);

  if (!user) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <AdminNav navLinks={navLinks} user={user} logout={logout} currentPath="/admin/mailer" />
      
      <div className="dashboard-content">
        <div className="container py-4">
          <h2 className="mb-4">
            <i className="fas fa-envelope me-2"></i>
            Email Management
          </h2>
          
          <div className="card mb-4">
            <div className="card-body">
              <div className="tabs-container">
                <div 
                  className={`tab ${activeTab === 0 ? 'active' : ''}`}
                  onClick={() => setActiveTab(0)}
                >
                  <i className="fas fa-users me-2"></i>
                  All Users
                </div>
                <div 
                  className={`tab ${activeTab === 1 ? 'active' : ''}`}
                  onClick={() => setActiveTab(1)}
                >
                  <i className="fas fa-user me-2"></i>
                  Specific User
                </div>
                <div 
                  className={`tab ${activeTab === 2 ? 'active' : ''}`}
                  onClick={() => setActiveTab(2)}
                >
                  <i className="fas fa-user-shield me-2"></i>
                  All Admins
                </div>
                <div 
                  className={`tab ${activeTab === 3 ? 'active' : ''}`}
                  onClick={() => setActiveTab(3)}
                >
                  <i className="fas fa-user-tie me-2"></i>
                  Specific Admin
                </div>
              </div>
              
              <TabPanel value={activeTab} index={0}>
                <p className="mt-3">Send an email to all registered users</p>
              </TabPanel>
              
              <TabPanel value={activeTab} index={1}>
                <div className="form-group mt-3">
                  <label>Select User</label>
                  <select
                    className="form-control"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">Select a user</option>
                    {filteredUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </TabPanel>
              
              <TabPanel value={activeTab} index={2}>
                <p className="mt-3">Send an email to all administrators</p>
              </TabPanel>
              
              <TabPanel value={activeTab} index={3}>
                <div className="form-group mt-3">
                  <label>Select Admin</label>
                  <select
                    className="form-control"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">Select an admin</option>
                    {filteredUsers
                      .filter(user => user.isAdmin || user.isSuperAdmin)
                      .map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                  </select>
                </div>
              </TabPanel>
              
              <div className="mt-4">
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="useHtml"
                    checked={useHtml}
                    onChange={(e) => setUseHtml(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="useHtml">
                    Use HTML Content
                  </label>
                </div>
                
                <div className="form-group">
                  <label>{useHtml ? 'HTML Content' : 'Message'}</label>
                  <textarea
                    className="form-control"
                    rows="8"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div className="d-flex justify-content-end mt-3">
                  <button
                    className="btn btn-primary"
                    onClick={handleSendEmail}
                    disabled={loading}
                  >
                    <i className="fas fa-paper-plane me-2"></i>
                    {loading ? 'Sending...' : 'Send Email'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-header d-flex align-items-center">
              <i className="fas fa-history me-2"></i>
              <h5 className="mb-0">Email History</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Subject</th>
                      <th>Recipients</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailHistory.length > 0 ? (
                      emailHistory.map((email) => (
                        <tr key={email._id} className="align-middle">
                          <td>{new Date(email.createdAt).toLocaleString()}</td>
                          <td>{email.subject}</td>
                          <td>
                            <i className="fas fa-user me-1"></i>
                            {Array.isArray(email.to) ? email.to.length : 1} recipients
                          </td>
                          <td>{email.metadata?.type || 'N/A'}</td>
                          <td>
                            <span className={`badge ${email.status === 'sent' ? 'bg-success' : 'bg-danger'} text-white`}>
                              {email.status || 'unknown'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No email history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="d-flex justify-content-between align-items-center p-3 border-top">
                <div className="form-group mb-0" style={{ width: '150px' }}>
                  <select 
                    className="form-select form-select-sm" 
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                  </select>
                </div>
                <div className="d-flex">
                  <button 
                    className="btn btn-sm btn-outline-secondary me-2" 
                    onClick={() => handleChangePage(page - 1)}
                    disabled={page === 0}
                  >
                    <i className="fas fa-chevron-left me-1"></i> Previous
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleChangePage(page + 1)}
                    disabled={(page + 1) * rowsPerPage >= totalEmails}
                  >
                    Next <i className="fas fa-chevron-right ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {snackbar.open && (
        <div 
          className={`alert alert-${snackbar.severity} alert-dismissible fade show position-fixed bottom-0 end-0 m-3`} 
          style={{ zIndex: 1050 }}
          role="alert"
        >
          {snackbar.message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={handleCloseSnackbar}
            aria-label="Close"
          ></button>
        </div>
      )}

      <style jsx>{`
        .tabs-container {
          display: flex;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #dee2e6;
        }
        
        .tab {
          padding: 0.75rem 1.25rem;
          cursor: pointer;
          border: 1px solid transparent;
          border-bottom: none;
          margin-right: 0.25rem;
          border-radius: 0.25rem 0.25rem 0 0;
          transition: all 0.2s;
        }
        
        .tab:hover {
          background-color: #f8f9fa;
        }
        
        .tab.active {
          background-color: #fff;
          border-color: #dee2e6 #dee2e6 #fff;
          color: #0d6efd;
        }
        
        .form-control, textarea, select {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border: 1px solid #ced4da;
          border-radius: 0.25rem;
        }
        
        .btn {
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-primary {
          background-color: #0d6efd;
          color: white;
          border: 1px solid #0d6efd;
        }
        
        .badge {
          display: inline-block;
          padding: 0.35em 0.65em;
          border-radius: 0.25rem;
          font-size: 0.75em;
          font-weight: 700;
          text-align: center;
        }
        
        .bg-success { background-color: #198754; }
        .bg-danger { background-color: #dc3545; }
        .text-white { color: white; }
      `}</style>
    </div>
  );
};

export default Mailer;