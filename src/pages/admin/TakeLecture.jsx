import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/Authcontext";
import { CourseContext } from "../../../context/CourseContext";
import "../../assets/styles/admin/takeLecture.css";
import { Link } from 'react-router-dom';
import AdminNav from "../../components/adminCom/navSection";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000";

const TakeLecture = () => {
  const { user } = useContext(AuthContext) || {};
  const { courses, loading: coursesLoading } = useContext(CourseContext);

  // Admins state
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);

  // Create lecture batch state
  const [form, setForm] = useState({
    courseId: "",
    startTime: "",
    platform: "Zoom",
    zoomLink: "",
    topics: "",
    jitsiPassword: "",
    isVerified: false,
    verificationToken: "",
    days: [],
    adminIds: user?._id ? [user._id] : [],
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Update lecture batch state
  const [updateId, setUpdateId] = useState("");
  const [updateForm, setUpdateForm] = useState({
    startTime: "",
    platform: "",
    zoomLink: "",
    topics: "",
    jitsiPassword: "",
    isVerified: false,
    verificationToken: "",
    days: [],
    lecturesListed: [],
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");
  const [updateErr, setUpdateErr] = useState("");
  const [lectures, setLectures] = useState([]);
  const [lecturesLoading, setLecturesLoading] = useState(false);

  // Fetch all admins for select input
  useEffect(() => {
    const fetchAdmins = async () => {
      setAdminsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/lectures/admins`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setAdmins(data.admins || []);
        }
      } catch (error) {}
      setAdminsLoading(false);
    };
    fetchAdmins();
  }, []);

  // Fetch all lectures for table
  const fetchLectures = async () => {
    setLecturesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/lectures/lectures`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        // Add an 'isExpired' flag to each lecture based on expiringDate
        const lecturesWithExpiry = (data.lectures || []).map(lecture => ({
          ...lecture,
          isExpired: lecture.expiringDate && new Date(lecture.expiringDate) <= new Date()
        }));
        setLectures(lecturesWithExpiry);
      }
    } catch (error) {
      console.error('Error fetching lectures:', error);
    } finally {
      setLecturesLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  // Handle create form change
  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    
    if (name === "adminIds") {
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setForm((prev) => ({
        ...prev,
        adminIds: selected,
      }));
    } else if (name === "days") {
      setForm(prev => {
        const newDays = checked
          ? [...prev.days, value]
          : prev.days.filter(day => day !== value);
        return { ...prev, days: newDays };
      });
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    setMsg("");
    setErr("");
  };

  // Handle update form change
  const handleUpdateChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    if (name === "lecturesListed") {
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setUpdateForm((prev) => ({
        ...prev,
        lecturesListed: selected,
      }));
    } else if (name === "days") {
      setUpdateForm(prev => {
        const newDays = checked
          ? [...prev.days, value]
          : prev.days.filter(day => day !== value);
        return { ...prev, days: newDays };
      });
    } else {
      setUpdateForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    setUpdateMsg("");
    setUpdateErr("");
  };

  // Fetch lecture details for update
  const fetchLecture = async (lectureId) => {
    setUpdateMsg("");
    setUpdateErr("");
    if (!lectureId) return;
    try {
      const res = await fetch(`${API_BASE}/lectures/lectures/${lectureId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUpdateForm({
          startTime: data.lecture.startTime?.slice(0, 16) || "",
          platform: data.lecture.platform || "",
          zoomLink: data.lecture.zoomLink || "",
          topics: Array.isArray(data.lecture.topics) ? data.lecture.topics.join(", ") : data.lecture.topics || "",
          jitsiPassword: data.lecture.jitsiPassword || "",
          isVerified: data.lecture.isVerified || false,
          verificationToken: data.lecture.verificationToken || "",
          days: Array.isArray(data.lecture.days) ? data.lecture.days : [],
          lecturesListed: Array.isArray(data.lecture.lecturesListed)
            ? data.lecture.lecturesListed.map(a => (typeof a === "object" ? a._id : a))
            : [],
        });
        setUpdateId(data.lecture._id);
      } else {
        setUpdateErr(data.message || "Lecture not found.");
      }
    } catch (err) {
      setUpdateErr("Error fetching lecture.");
    }
  };

  // Handle create lecture batch submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErr("");
    if (!form.courseId || !form.startTime || !form.platform || !form.adminIds.length || form.days.length === 0 || !form.days.length === 0) {
      setErr("All fields are required, including at least one day of the week.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/lectures/create-lecture-batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...form,
          topics: form.topics.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Lecture batch created successfully!");
        setForm({
          courseId: "",
          startTime: "",
          platform: "Zoom",
          zoomLink: "",
          topics: "",
          jitsiPassword: "",
          isVerified: false,
          verificationToken: "",
          days: [],
          adminIds: user?._id ? [user._id] : [],
        });
        fetchLectures();
      } else {
        setErr(data.message || "Failed to create lecture batch.");
      }
    } catch (error) {
      setErr("Network error. Please try again.");
    }
    setLoading(false);
  };

  // Handle update lecture batch submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMsg("");
    setUpdateErr("");
    if (!updateId) {
      setUpdateErr("Lecture ID is required.");
      setUpdateLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/lectures/update-lecture/${updateId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...updateForm,
          topics: updateForm.topics.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUpdateMsg("Lecture batch updated successfully!");
        fetchLectures();
        setUpdateId("");
        setUpdateForm({
          startTime: "",
          platform: "",
          zoomLink: "",
          topics: "",
          jitsiPassword: "",
          isVerified: false,
          verificationToken: "",
          days: [],
          lecturesListed: [],
        });
      } else {
        setUpdateErr(data.message || "Failed to update lecture batch.");
      }
    } catch (error) {
      setUpdateErr("Network error. Please try again.");
    }
    setUpdateLoading(false);
  };

  // Handle delete lecture
  const handleDelete = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture batch?")) return;
    try {
      const res = await fetch(`${API_BASE}/lectures/${lectureId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        fetchLectures();
      } else {
        alert(data.message || "Failed to delete lecture batch.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  const handleEdit = (lectureId) => {
    fetchLecture(lectureId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const { logout } = useContext(AuthContext);

  return (
    <div className="take-lecture-wrapper">
      <AdminNav navLinks={navLinks} onLogout={logout} />
      <div className="take-lecture-container">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="set-class-section">
          <h3 className="set-class-title">Create Lecture Batch</h3>
          <form className="set-class-form" onSubmit={handleSubmit}>
            <label>
              Course:
              <select
                name="courseId"
                value={form.courseId}
                onChange={handleChange}
                required
              >
                <option value="">Select course</option>
                {coursesLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  courses.map((c) => (
                    <option key={c._id} value={c._id}>{c.course}</option>
                  ))
                )}
              </select>
            </label>
            <label>
              Admin(s):
              <select
                name="adminIds"
                value={form.adminIds}
                onChange={handleChange}
                multiple
                required
                style={{ minHeight: "2.5em" }}
              >
                {adminsLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  admins.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name} ({a.email})
                    </option>
                  ))
                )}
              </select>
              <small>Select one or more admins</small>
            </label>
            <label>
              Start Time:
              <input
                type="datetime-local"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
              />
            </label>
            <div className="form-group">
              <label>Platform</label>
              <select
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="Zoom">Zoom</option>
                <option value="Jitsi">Jitsi</option>
              </select>
            </div>
            <div className="form-group">
              <label>Days of the Week (Select all that apply) *</label>
              <div className="days-checkbox-container">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <div key={day} className="day-checkbox">
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      name="days"
                      value={day}
                      checked={form.days.includes(day)}
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label htmlFor={`day-${day}`} className="form-check-label">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <label>
              Meeting Link:
              <input
                type="text"
                name="zoomLink"
                value={form.zoomLink}
                onChange={handleChange}
                required={form.platform !== "Zoom"}
                placeholder="Paste Zoom/Meet/Jitsi link"
                disabled={form.platform === "Zoom"}
              />
            </label>
            <label>
              Topics (comma separated):
              <input
                type="text"
                name="topics"
                value={form.topics}
                onChange={handleChange}
                placeholder="e.g. JSX, State, Props"
              />
            </label>
            {form.platform === "Jitsi" && (
              <label>
                Jitsi Password (optional):
                <input
                  type="text"
                  name="jitsiPassword"
                  value={form.jitsiPassword}
                  onChange={handleChange}
                  placeholder="Set a password for Jitsi room"
                />
              </label>
            )}
            <label style={{ display: "none" }}>
              Is Verified:
              <input
                type="checkbox"
                name="isVerified"
                checked={form.isVerified}
                onChange={handleChange}
              />
            </label>
            <label style={{ display: "none" }}>
              Verification Token:
              <input
                type="text"
                name="verificationToken"
                value={form.verificationToken}
                onChange={handleChange}
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Lecture Batch"}
            </button>
            {msg && <div className="set-class-success">{msg}</div>}
            {err && <div className="set-class-error">{err}</div>}
          </form>
        </div>

        <div className="lecture-table-section" style={{ marginTop: "2rem" }}>
          <h3 className="update-lecture-title" style={{ color: '#fff', fontSize: '3rem' }}>All Active Lecture Batches</h3>
          {lecturesLoading ? (
            <div>Loading lectures...</div>
          ) : lectures.length === 0 ? (
            <div>No active lectures found.</div>
          ) : (
            <table className="lecture-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th className="hide">Start Time</th>
                  <th className="hide">Platform</th>
                  <th>Meeting Link</th>
                  <th className="hide">Topics</th>
                  <th className="hide">Admins</th>
                  <th>Actions</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lectures.map(lecture => (
                  <tr key={lecture._id} className={lecture.isExpired ? 'expired-lecture' : ''}>
                    <td>{lecture.title}</td>
                    <td className="hide">{lecture.startTime ? new Date(lecture.startTime).toLocaleString() : ""}</td>
                    <td className="hide">{lecture.platform}</td>
                    <td>
                      <a href={lecture.zoomLink} target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                    <td className="hide">
                      {Array.isArray(lecture.topics)
                        ? lecture.topics.join(", ")
                        : lecture.topics}
                    </td>
                    <td className="hide">
                      {Array.isArray(lecture.lecturesListed)
                        ? lecture.lecturesListed.map(a =>
                            a.name ? a.name : a
                          ).join(", ")
                        : ""}
                    </td>
                    <td>
                      <button onClick={() => handleEdit(lecture._id)}>Edit</button>
                      <button onClick={() => handleDelete(lecture._id)} style={{ marginLeft: 8, color: "red" }}>
                        Delete
                      </button>
                    </td>
                    <td>
                      {lecture.isExpired && <span className="badge bg-danger">Expired</span>}
                      {!lecture.isExpired && lecture.expiringDate && (
                        <span className="badge bg-warning">Expires: {new Date(lecture.expiringDate).toLocaleDateString()}</span>
                      )}
                      {!lecture.expiringDate && <span className="badge bg-success">No Expiry</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {updateId && (
          <div className="update-lecture" style={{ marginTop: "2rem" }}>
            <h3 className="update-lecture-title">Update Lecture Batch</h3>
            <form className="set-class-form" onSubmit={handleUpdateSubmit}>
              <label>
                Start Time:
                <input
                  type="datetime-local"
                  name="startTime"
                  value={updateForm.startTime}
                  onChange={handleUpdateChange}
                />
              </label>
              <label>
                Platform:
                <select
                  name="platform"
                  value={updateForm.platform}
                  onChange={handleUpdateChange}
                >
                  <option value="">Select platform</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="Jitsi">Jitsi</option>
                </select>
              </label>
              <label>
                Meeting Link:
                <input
                  type="text"
                  name="zoomLink"
                  value={updateForm.zoomLink}
                  onChange={handleUpdateChange}
                  placeholder="Paste Zoom/Meet/Jitsi link"
                />
              </label>
              <label>
                <p>Days of the Week (Select all that apply) *</p>
                <div className="days-checkbox-container">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="day-checkbox">
                      <input
                        type="checkbox"
                        id={`day-${day}`}
                        name="days"
                        value={day}
                        checked={updateForm.days.includes(day)}
                        onChange={handleUpdateChange}
                        className="form-check-input"
                      />
                      <label htmlFor={`day-${day}`} className="form-check-label">
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
            </label>
              <label>
                Topics (comma separated):
                <input
                  type="text"
                  name="topics"
                  value={updateForm.topics}
                  onChange={handleUpdateChange}
                  placeholder="e.g. JSX, State, Props"
                />
              </label>
              <label>
                Admin(s):
                <select
                  name="lecturesListed"
                  value={updateForm.lecturesListed}
                  onChange={handleUpdateChange}
                  multiple
                  required
                  style={{ minHeight: "2.5em" }}
                >
                  {adminsLoading ? (
                    <option disabled>Loading...</option>
                  ) : (
                    admins.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name} ({a.email})
                      </option>
                    ))
                  )}
                </select>
                <small>Select one or more admins</small>
              </label>
              {updateForm.platform === "Jitsi" && (
                <label>
                  Jitsi Password (optional):
                  <input
                    type="text"
                    name="jitsiPassword"
                    value={updateForm.jitsiPassword}
                    onChange={handleUpdateChange}
                    placeholder="Set a password for Jitsi room"
                  />
                </label>
              )}
              <label style={{ display: "none" }}>
                Is Verified:
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={updateForm.isVerified}
                  onChange={handleUpdateChange}
                />
              </label>
              <label style={{ display: "none" }}>
                Verification Token:
                <input
                  type="text"
                  name="verificationToken"
                  value={updateForm.verificationToken}
                  onChange={handleUpdateChange}
                />
              </label>
              <button type="submit" disabled={updateLoading}>
                {updateLoading ? "Updating..." : "Update Lecture Batch"}
              </button>
              {updateMsg && <div className="set-class-success">{updateMsg}</div>}
              {updateErr && <div className="set-class-error">{updateErr}</div>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeLecture;