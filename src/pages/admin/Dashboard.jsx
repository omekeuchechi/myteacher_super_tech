import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/Authcontext";
import { CourseContext } from "../../../context/CourseContext";
import { Link } from "react-router-dom";
import Pusher from "pusher-js";
import "../../assets/styles/admin/dashboard.css";
const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const navLinks = [
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

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { courses, loading: coursesLoading, fetchCourses } = useContext(CourseContext);
  const [stats, setStats] = useState({
    users: 0,
    enrollments: 0,
    transactions: 0,
    messages: 0,
    assets: 0,
    blogs: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {}
      setLoading(false);
    };
    fetchStats();

    // Listen for real-time updates via Pusher
    const pusherKey = import.meta.env.VITE_PUSHER_KEY;
    const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER;
    let pusher, channel;
    if (pusherKey && pusherCluster) {
      pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
        forceTLS: true,
      });

      channel = pusher.subscribe("admin-dashboard");
      channel.bind("stats-updated", function (data) {
        setStats(data);
      });
    }

    return () => {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
      if (pusher) {
        pusher.disconnect();
      }
    };
  }, []);

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

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="admin-logo">Admin Dashboard</div>
        <input type="checkbox" id="admin-nav-toggle" className="admin-nav-toggle" />
        <label htmlFor="admin-nav-toggle" className="admin-nav-hamburger">
          <span></span>
          <span></span>
          <span></span>
        </label>
        <ul className="admin-nav-links">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
          <li onClick={logout} className="admin-nav-logout">
              <i className="fas fa-sign-out-alt"></i> Logout
          </li>
        </ul>
      </nav>
      <main className="admin-main-content">
        <h1>Welcome, Admin {user.name}!</h1>
        <p>Select a section from the navigation above to manage the platform.</p>
        <Link to="/admin/super-admin-list">
          <i className="fas fa-user-tie"></i>
        </Link>
        <div className="admin-dashboard-stats">
          {loading ? (
            <div>Loading stats...</div>
          ) : (
            <div className="stats-grid">
              <div className="stat-card">
                <h2>{stats.users}</h2>
                <p>Users</p>
              </div>
              <div className="stat-card">
                <h2>{stats.enrollments}</h2>
                <p>Enrollments</p>
              </div>
              <div className="stat-card">
                <h2>{stats.transactions}</h2>
                <p>Transactions</p>
              </div>
              <div className="stat-card">
                <h2>{stats.messages}</h2>
                <p>Contact Messages</p>
              </div>
              <div className="stat-card">
                <h2>{stats.assets}</h2>
                <p>Assets</p>
              </div>
              <div className="stat-card">
                <h2>{stats.blogs}</h2>
                <p>Blogs</p>
              </div>
            </div>
          )}
        </div>

        <div className="add-course-section">
          <h2 className="add-course-title">Add New Course</h2>
          <AddCourseForm onSuccess={fetchCourses} />
        </div>

        <div className="course-list-section">
          <h2 className="add-course-title" style={{ marginTop: 32 }}>All Courses</h2>
          {coursesLoading ? (
            <div>Loading courses...</div>
          ) : (
            <CourseList
              courses={courses}
              onUpdate={handleUpdateCourse}
              onDelete={handleDeleteCourse}
            />
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