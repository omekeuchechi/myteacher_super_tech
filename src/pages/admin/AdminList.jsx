import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify'; // Optional: if you want to show toasts
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState(null); // For delete/suspend operations

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
          // "Content-Type": "application/json", // Usually not needed if the PATCH request doesn't send a body
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

  return (
    <div style={{ padding: "20px" }} className="admin-admins-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Admin Users</h2>
      <p>List of users with administrative privileges.</p>

      <input
        type="search"
        placeholder="Search by name or email..."
        className="search-admin" // You might want to add specific styles for this
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: "1rem", padding: "8px", width: "300px" }}
      />

      {loading && <div>Loading admins...</div>}
      {error && <div style={{ color: "red", marginTop: "1rem" }}>Error: {error}</div>}

      {!loading && !error && (
        filteredAdmins.length === 0 ? <p style={{ marginTop: "1rem" }}>{searchQuery ? "No admins match your search." : "No admin users found."}</p> :
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Name</th>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Email</th>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Status</th>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <tr key={admin._id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{admin.name}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{admin.email}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {admin.isSuspended ? <span style={{color: "orange"}}>Suspended</span> : <span style={{color: "green"}}>Active</span>}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <button
                    onClick={() => handleToggleAdminSuspension(admin._id, admin.isSuspended)}
                    disabled={processingId === admin._id}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: processingId === admin._id 
                                        ? "#ccc" 
                                        : admin.isSuspended ? "#28a745" : "#f0ad4e", // Green for Unsuspend, Orange for Suspend
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: processingId === admin._id ? "not-allowed" : "pointer",
                      marginRight: "5px",
                    }}
                  >
                    {processingId === admin._id 
                      ? (admin.isSuspended ? "Unsuspending..." : "Suspending...") 
                      : (admin.isSuspended ? "Unsuspend" : "Suspend")}
                  </button>
                  <button
                    onClick={() => handleDeleteAdmin(admin._id)}
                    disabled={processingId === admin._id}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: processingId === admin._id ? "#ccc" : "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: processingId === admin._id ? "not-allowed" : "pointer",
                    }}
                  >
                    {processingId === admin._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminList;