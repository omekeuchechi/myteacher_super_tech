import React, { useEffect, useState, useContext } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNav from "../../components/adminCom/navSection";
import { AuthContext } from '../../../context/Authcontext';
import '../../assets/styles/admin/users.css';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const Users = () => {
  const { logout } = useContext(AuthContext);
  const navLinks = [
    { to: "/", label: "Home" },
    // { to: "/admin/ui-settings", label: "UI Settings" },
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/take-lecture", label: "Take Lecture" },
    { to: "/admin/profile", label: "Profile" },
    // { to: "/admin/users", label: "Users" },
    // { to: "/admin/transactions", label: "Transactions" },
    { to: "/admin/enrollments", label: "Enrollment" },
    { to: "/admin/admin-list", label: "Admin List" },
    // { to: "/admin/contact-messages", label: "Contact Messages" },
    { to: "/admin/publish-asset", label: "Publish Asset" },
    // { to: "/admin/post-blog", label: "Post Blog" },
  ];
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/user`, { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch users");
        }
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    setDeletingId(userId);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/user/${userId}/deleteUser`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "User deleted successfully!");
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } else {
        throw new Error(data.message || "Failed to delete user");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Could not delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const isVerifiedString = user.isVerified ? "yes" : "no";
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      isVerifiedString.includes(query)
    );
  }).slice(0, 50); // Limit to 50 users

  if (loading && users.length === 0) {
    return (
      <div className="loading-state">
        <p>Loading users...</p>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="delete-btn"
          style={{ marginTop: '1rem' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <AdminNav navLinks={navLinks} onLogout={logout} />
      <div className="users-container">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <header className="users-header">
          <h2>Users</h2>
          <p>Manage platform users here.</p>
        </header>

        <div className="search-container">
          <input 
            type="search" 
            placeholder="Search by name, email, or verified status (yes/no)" 
            className="search-user" 
            value={searchQuery} 
            onChange={handleSearchChange} 
          />
        </div>

        {!loading && !error && (
          filteredUsers.length === 0 ? (
            <div className="empty-state">
              {searchQuery ? "No users match your search." : "No users found."}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Verified</th>
                    <th>Admin</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td data-label="Name">{user.name || 'N/A'}</td>
                      <td data-label="Email">{user.email || 'N/A'}</td>
                      <td data-label="Verified">
                        <span className={`status-badge ${user.isVerified ? 'verified' : 'unverified'}`}>
                          {user.isVerified ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td data-label="Admin">
                        {user.isAdmin && (
                          <span className="status-badge admin">Yes</span>
                        )}
                      </td>
                      <td data-label="Actions">
                        <div className="action-buttons">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={deletingId === user._id}
                            className="delete-btn"
                          >
                            {deletingId === user._id ? (
                              <>
                                <span className="spinner"></span>
                                Deleting...
                              </>
                            ) : (
                              'Delete User'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Users;