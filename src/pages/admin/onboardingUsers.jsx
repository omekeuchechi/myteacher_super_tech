import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/admin/onboardingUsers.css'; // We'll create this CSS file

const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const OnboardingUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        startDate: '',
        endDate: ''
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const API_BASE = import.meta.env.VITE_BASEURL;
    const PUSHER_APP_KEY = import.meta.env.VITE_PUSHER_KEY;
    const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || 'mt1';

    // Initialize Pusher
    useEffect(() => {
        const pusher = new Pusher(PUSHER_APP_KEY, {
            cluster: PUSHER_CLUSTER,
            encrypted: true
        });

        const channel = pusher.subscribe('onboarding');
        channel.bind('new-submission', (data) => {
            toast.info(`New submission from ${data.name}`);
            fetchUsers();
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/onboarding`, {
                params: {
                    page: currentPage,
                    limit: 10,
                    ...filters
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setUsers(response.data.data);
            setTotalPages(response.data.pagination?.totalPages || 1);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchUsers();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${API_BASE}/onboarding/delete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user');
            }
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, filters]);

    return (
        <>
        <div className="onboarding-container">
            <div className="header">
                <h1>Onboarding Users</h1>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                        className="search-input"
                    />
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                        className="status-select"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="enrolled">Enrolled</option>
                    </select>
                    <input
                        type="date"
                        onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                        className="date-input"
                    />
                    <span>to</span>
                    <input
                        type="date"
                        onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                        className="date-input"
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>+{user.countryCode} {user.phone}</td>
                                    <td>{formatDate(user.createdAt)}</td>
                                    <td className="actions">
                                        <button 
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setIsModalOpen(true);
                                            }}
                                            className="view-button"
                                        >
                                            View
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={currentPage === page ? 'active' : ''}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isModalOpen && selectedUser && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>User Details</h2>
                            <button onClick={() => setIsModalOpen(false)} className="close-button">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="user-details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Name:</span>
                                    <span className="detail-value">{selectedUser.name}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Email:</span>
                                    <span className="detail-value">{selectedUser.email}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Phone:</span>
                                    <span className="detail-value">+{selectedUser.countryCode} {selectedUser.phone}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Joined Date:</span>
                                    <span className="detail-value">{formatDate(selectedUser.createdAt)}</span>
                                </div>
                                {selectedUser.metadata && (
                                    <>
                                        <div className="detail-item full-width">
                                            <h3>Additional Information</h3>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">IP Address:</span>
                                            <span className="detail-value">{selectedUser.metadata.ipAddress}</span>
                                        </div>
                                        <div className="detail-item full-width">
                                            <span className="detail-label">User Agent:</span>
                                            <span className="detail-value small">{selectedUser.metadata.userAgent}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default OnboardingUsers;