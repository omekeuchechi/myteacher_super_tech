import React, { useEffect, useState, useContext } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNav from "../../components/adminCom/navSection";
import { AuthContext } from "../../../context/Authcontext";
import '../../assets/styles/admin/adminList.css'; // Import the CSS file
import '@fortawesome/fontawesome-free/css/all.min.css';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const AdminList = () => {
  const { logout } = useContext(AuthContext);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState(null); // For delete/suspend operations

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

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        const res = await fetch(`${API_BASE}/admin/admins`, { 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch admins");
        }
        
        setAdmins(data.admins || []);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Could not fetch admins.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredAdmins = admins.filter((admin) => {
    const query = searchQuery.toLowerCase();
    return (
      admin.name.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query)
    );
  }).slice(0, 50); // Limit to 50 admins

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin? This action cannot be undone.")) {
      return;
    }
    setProcessingId(adminId);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/admin/admins/${adminId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Admin deleted successfully!");
        setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== adminId));
      } else {
        throw new Error(data.message || "Failed to delete admin");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Could not delete admin.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleAdminSuspension = async (adminId, currentSuspendedStatus) => {
    const action = currentSuspendedStatus ? "unsuspend" : "suspend";
    const confirmMessage = `Are you sure you want to ${action} this admin?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setProcessingId(adminId);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const endpoint = currentSuspendedStatus 
        ? `${API_BASE}/admin/admins/unsuspend/${adminId}` 
        : `${API_BASE}/admin/admins/suspend/${adminId}`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || `Admin ${action}ed successfully!`);
        setAdmins((prevAdmins) => 
          prevAdmins.map(admin => 
            admin._id === adminId 
              ? { ...admin, isSuspended: !currentSuspendedStatus } // Toggle the status
              : admin
          )
        );
      } else {
        throw new Error(data.message || `Failed to ${action} admin`);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || `Could not ${action} admin.`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && admins.length === 0) {
    return (
      <div className="loading-state">
        <i className="fas fa-spinner fa-spin spinner"></i>
        <p>Loading admins...</p>
      </div>
    );
  }

  if (error && admins.length === 0) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-delete"
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
      <div className="admin-list-container">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <header className="admin-list-header">
          <h2>Admin Users</h2>
          <p>List of users with administrative privileges.</p>
        </header>

        <div className="search-container">
          <input
            type="search"
            placeholder="Search by name or email..."
            className="search-admin"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {!loading && !error && (
          filteredAdmins.length === 0 ? (
            <div className="empty-state">
              {searchQuery ? "No admins match your search." : "No admin users found."}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admins-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin) => {
                    const isProcessing = processingId === admin._id;
                    const isSuspended = admin.isSuspended;
                    
                    return (
                      <tr key={admin._id}>
                        <td data-label="Name">{admin.name || 'N/A'}</td>
                        <td data-label="Email">{admin.email || 'N/A'}</td>
                        <td data-label="Status">
                          <span className={`status-badge ${isSuspended ? 'suspended' : 'active'}`}>
                            {isSuspended ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td data-label="Actions">
                          <div className="action-buttons">
                            <button
                              onClick={() => handleToggleAdminSuspension(admin._id, isSuspended)}
                              disabled={isProcessing}
                              className={`btn ${isSuspended ? 'btn-unsuspend' : 'btn-suspend'}`}
                            >
                              {isProcessing ? (
                                <>
                                  <i className="fas fa-spinner fa-spin spinner"></i>
                                  {isSuspended ? 'Unsuspending...' : 'Suspending...'}
                                </>
                              ) : (
                                <>
                                  {isSuspended ? <i className="fas fa-user-check"></i> : <i className="fas fa-user-slash"></i>}
                                  {isSuspended ? 'Unsuspend' : 'Suspend'}
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(admin._id)}
                              disabled={isProcessing}
                              className="btn btn-delete"
                            >
                              {isProcessing ? (
                                <FontAwesomeIcon icon={faSpinner} className="spinner" spin />
                              ) : (
                                <i className="fas fa-trash"></i>
                              )}
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default AdminList;