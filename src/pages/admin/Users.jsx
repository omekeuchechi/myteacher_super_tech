import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const Users = () => {
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
        const res = await fetch(`${API_BASE}/user`, { // Backend route is mounted at /api/v1/user
        // const res = await fetch("http://localhost:5000/api/v1/users", { // This line was duplicated or a merge artifact
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

  return (
    <div style={{ padding: "20px" }} className="admin-users-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Users</h2>
      <p>Manage platform users here.</p>
      <input type="search" placeholder="Search by name, email, or verified status (yes/no)" className="search-user" value={searchQuery} onChange={handleSearchChange} style={{ marginBottom: "1rem", padding: "8px", width: "300px" }}/>
      {loading && <div>Loading users...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && !error && (
        filteredUsers.length === 0 ? <p>{searchQuery ? "No users match your search." : "No users found."}</p> :
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Verified</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Admin</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{u.name}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{u.email}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{u.isVerified ? "Yes" : "No"}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{u.isAdmin ? "Yes" : "No"}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    disabled={deletingId === u._id}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: deletingId === u._id ? "#ccc" : "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: deletingId === u._id ? "not-allowed" : "pointer",
                    }}
                  >
                    {deletingId === u._id ? "Deleting..." : "Delete"}
                  </button>
                  {/* Add Edit button/functionality here if needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;