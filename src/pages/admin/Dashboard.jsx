import React, { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../../../context/Authcontext";
import { CourseContext } from "../../../context/CourseContext";
import { Link, useNavigate } from "react-router-dom";
import Pusher from "pusher-js";
import "../../assets/styles/admin/dashboard.css";
import AdminNav from "../../components/adminCom/navSection";

const API_BASE = import.meta.env.VITE_BASEURL;

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/admin/ui-settings", label: "UI Settings" },
  { to: "/admin/take-lecture", label: "Take Lecture" },
  { to: "/admin/profile", label: "Profile" },
  { to: "/admin/media-video", label: "Media Video" },
  // { to: "/admin/users", label: "Users" },
  // { to: "/admin/transactions", label: "Transactions" },
  { to: "/admin/enrollments", label: "Enrollment" },
  { to: "/admin/admin-list", label: "Admin List" },
  { to: "/admin/contact-messages", label: "Contact Messages" },
  { to: "/admin/create-assignment", label: "Create Assignment" },
  { to: "/admin/assignment-corrections", label: "Assignment Corrections" },
  // { to: "/admin/publish-asset", label: "Publish Asset" },
  // { to: "/admin/post-blog", label: "Post Blog" },
  // { to: "/admin/mailer", label: "Mailer" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const { courses, loading: coursesLoading, fetchCourses } = useContext(CourseContext);
  // Initialize stats with default values
  const defaultStats = {
    users: 0,
    enrollments: 0,
    transactions: 0,
    messages: 0,
    assets: 0,
    blogs: 0,
  };

  const [stats, setStats] = useState({ ...defaultStats });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await fetch(`${API_BASE}/admin/dashboard-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Token expired or invalid
          logout();
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await res.json();
      // Ensure all expected stats are present with valid numbers
      const safeData = {
        ...defaultStats,
        ...data,
      };

      // Convert all values to numbers and ensure they're valid
      Object.keys(safeData).forEach(key => {
        safeData[key] = isNaN(Number(safeData[key])) ? 0 : Number(safeData[key]);
      });

      setStats(safeData);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(err.message || "Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [navigate, logout]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Initialize Pusher for real-time updates
  useEffect(() => {
    const pusherKey = import.meta.env.VITE_PUSHER_KEY;
    const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.warn('Pusher key or cluster not found. Real-time updates disabled.');
      return;
    }

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      encrypted: true
    });

    const channel = pusher.subscribe('admin-dashboard');
    channel.bind('stats-updated', fetchStats);

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [fetchStats]);

  // Handle course update
  const handleUpdateCourse = async (id, updatedData, cb) => {
    try {
      const res = await fetch(`${API_BASE}/admin/courses/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok) {
        fetchCourses();
        if (cb) cb(true, "Course updated!");
      } else {
        if (cb) cb(false, data.message || "Failed to update course.");
      }
    } catch (err) {
      if (cb) cb(false, "Network error.");
    }
  };

  // Handle course delete
  const handleDeleteCourse = async (id, cb) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`${API_BASE}/admin/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        fetchCourses();
        if (cb) cb(true, "Course deleted!");
      } else {
        if (cb) cb(false, data.message || "Failed to delete course.");
      }
    } catch (err) {
      if (cb) cb(false, "Network error.");
    }
  };

  // Handle loading state
  if (authLoading || (loading && !error)) {
    return (
      <div className="admin-dashboard">
        <AdminNav navLinks={navLinks} onLogout={logout} />
        <main className="admin-main-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  // Handle case when user is not authenticated
  if (!user) {
    return (
      <div className="admin-dashboard">
        <AdminNav navLinks={navLinks} onLogout={logout} />
        <main className="admin-main-content">
          <div className="error-container">
            <h2>Not Authorized</h2>
            <p>Please log in to access the admin dashboard.</p>
            <Link to="/login" className="btn btn-primary">Go to Login</Link>
          </div>
        </main>
      </div>
    );
  }

  // Display error message if fetch failed
  if (error) {
    return (
      <div className="admin-dashboard">
        <AdminNav navLinks={navLinks} onLogout={logout} />
        <main className="admin-main-content">
          <div className="error-container">
            <h2>Error Loading Dashboard</h2>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={fetchStats}
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminNav navLinks={navLinks} onLogout={logout} />
      <main className="admin-main-content">
        <header className="dashboard-header">
          <h1>Welcome back, {user.name || 'Admin'}!</h1>
          <p className="dashboard-subtitle">Here's what's happening with your platform today.</p>
        </header>

        <section className="admin-dashboard-stats">
          <h2 className="section-title">Platform Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h2>{typeof stats.users === 'number' ? stats.users.toLocaleString() : '0'}</h2>
              <p>Total Users</p>
            </div>
            <div className="stat-card">
              <h2>{typeof stats.enrollments === 'number' ? stats.enrollments.toLocaleString() : '0'}</h2>
              <p>Enrollments</p>
            </div>
            <div className="stat-card">
              <h2>{typeof stats.transactions === 'number' ? stats.transactions.toLocaleString() : '0'}</h2>
              <p>Transactions</p>
            </div>
            <div className="stat-card">
              <h2>{typeof stats.messages === 'number' ? stats.messages.toLocaleString() : '0'}</h2>
              <p>Messages</p>
            </div>
            <div className="stat-card">
              <h2>{typeof stats.assets === 'number' ? stats.assets.toLocaleString() : '0'}</h2>
              <p>Assets</p>
            </div>
            <div className="stat-card">
              <h2>{typeof stats.blogs === 'number' ? stats.blogs.toLocaleString() : '0'}</h2>
              <p>Blog Posts</p>
            </div>
          </div>
        </section>

        <div className="dashboard-actions">
          <div className="add-course-section">
            <h2 className="section-title">Add New Course</h2>
            <AddCourseForm onSuccess={() => {
              fetchStats();
              fetchCourses();
            }} />
          </div>

          <div className="quick-links">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-links-grid">
              <Link to="/admin/users" className="quick-link">
                <i className="fas fa-users"></i>
                <span>Manage Users</span>
              </Link>
              <Link to="/admin/publish-asset" className="quick-link">
                <i className="fas fa-upload"></i>
                <span>Upload Asset</span>
              </Link>
              <Link to="/admin/post-blog" className="quick-link">
                <i className="fas fa-edit"></i>
                <span>Write Blog Post</span>
              </Link>
              <Link to="/admin/transactions" className="quick-link">
                <i className="fas fa-exchange-alt"></i>
                <span>View Transactions</span>
              </Link>
              <Link to="/admin/mailer" className="quick-link">
                <i className="fas fa-envelope"></i>
                <span>Mailer</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="course-list-section">
          <div className="section-header">
            <h2 className="section-title">Your Courses</h2>
          </div>
          {coursesLoading ? (
            <div className="loading-text">Loading courses...</div>
          ) : courses && courses.length > 0 ? (
            <CourseList
              courses={courses.slice(0, 5)} // Show only first 5 courses
              onUpdate={handleUpdateCourse}
              onDelete={handleDeleteCourse}
            />
          ) : (
            <div className="empty-state">
              <i className="fas fa-book-open"></i>
              <p>No courses found. Create your first course to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// AddCourseForm component
function AddCourseForm({ onSuccess }) {
  const [form, setForm] = useState({
    course: "",
    courseDescription: "",
    price: "",
    durationWeeks: "",
    courseIntructor: "",
    courseImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg("");
    setErr("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErr("");
    if (!form.course || !form.price || !form.durationWeeks) {
      setErr("Course name, price, and duration are required.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/v1/admin/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Course added successfully!");
        setForm({
          course: "",
          courseDescription: "",
          price: "",
          durationWeeks: "",
          courseIntructor: "",
          courseImage: "",
        });
        if (onSuccess) onSuccess();
      } else {
        setErr(data.message || "Failed to add course.");
      }
    } catch (error) {
      setErr("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <form className="add-course-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          name="course"
          placeholder="Course Name *"
          value={form.course}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <textarea
          name="courseDescription"
          placeholder="Course Description"
          value={form.courseDescription}
          onChange={handleChange}
          rows={2}
        />
      </div>
      <div className="form-row">
        <input
          type="number"
          name="price"
          placeholder="Price (₦) *"
          value={form.price}
          onChange={handleChange}
          required
          min={0}
        />
        <input
          type="number"
          name="durationWeeks"
          placeholder="Duration (weeks) *"
          value={form.durationWeeks}
          onChange={handleChange}
          required
          min={1}
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          name="courseIntructor"
          placeholder="Instructor"
          value={form.courseIntructor}
          onChange={handleChange}
        />
        <input
          type="text"
          name="courseImage"
          placeholder="Image URL"
          value={form.courseImage}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Course"}
      </button>
      {msg && <div className="form-success">{msg}</div>}
      {err && <div className="form-error">{err}</div>}
    </form>
  );
}

// CourseList component for displaying, editing, and deleting courses
function CourseList({ courses, onUpdate, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editMsg, setEditMsg] = useState("");
  const [editErr, setEditErr] = useState("");

  const startEdit = (course) => {
    setEditId(course._id);
    setEditForm({
      course: course.course,
      courseDescription: course.courseDescription,
      price: course.price,
      durationWeeks: course.durationWeeks,
      courseIntructor: course.courseIntructor,
      courseImage: course.courseImage,
    });
    setEditMsg("");
    setEditErr("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({});
    setEditMsg("");
    setEditErr("");
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    setEditMsg("");
    setEditErr("");
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm.course || !editForm.price || !editForm.durationWeeks) {
      setEditErr("Course name, price, and duration are required.");
      return;
    }
    onUpdate(editId, editForm, (success, msg) => {
      if (success) {
        setEditMsg(msg);
        setTimeout(cancelEdit, 800);
      } else {
        setEditErr(msg);
      }
    });
  };

  return (
    <div className="course-list-table-wrapper">
      <table className="course-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>₦ Price</th>
            <th>Weeks</th>
            <th>Instructor</th>
            <th>Image</th>
            <th style={{ minWidth: 110 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) =>
            editId === c._id ? (
              <tr key={c._id}>
                <td>
                  <input
                    type="text"
                    name="course"
                    value={editForm.course}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <textarea
                    name="courseDescription"
                    value={editForm.courseDescription}
                    onChange={handleEditChange}
                    rows={1}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="durationWeeks"
                    value={editForm.durationWeeks}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="courseIntructor"
                    value={editForm.courseIntructor}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="courseImage"
                    value={editForm.courseImage}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <button className="edit-btn" onClick={handleEditSubmit}>Save</button>
                  <button className="delete-btn" onClick={cancelEdit}>Cancel</button>
                  {editMsg && <div className="form-success">{editMsg}</div>}
                  {editErr && <div className="form-error">{editErr}</div>}
                </td>
              </tr>
            ) : (
              <tr key={c._id}>
                <td>{c.course}</td>
                <td style={{ maxWidth: 120, whiteSpace: "pre-line" }}>{c.courseDescription}</td>
                <td>{c.price}</td>
                <td>{c.durationWeeks}</td>
                <td>{c.courseIntructor}</td>
                <td>
                  {c.courseImage ? (
                    <img src={c.courseImage} alt="" style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 4 }} />
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <button className="edit-btn" onClick={() => startEdit(c)}>Edit</button>
                  <button className="delete-btn" onClick={() => onDelete(c._id)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;