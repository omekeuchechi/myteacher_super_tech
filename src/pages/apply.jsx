import { useState, useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import { CourseContext } from "../../context/CourseContext";

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const Apply = () => {
  const { user } = useContext(AuthContext) || {};
  const { courses, loading: coursesLoading } = useContext(CourseContext);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    courseId: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handlePaystack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    if (!form.courseId) {
      setErrorMsg("Please select a course.");
      setLoading(false);
      return;
    }
    try {
      // Find the course object by id
      const selectedCourse = courses.find(
        (c) => String(c._id) === String(form.courseId)
      );
      if (!selectedCourse) {
        setErrorMsg("Selected course not found.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/transaction/pay/paystack`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user?._id,
          courseId: form.courseId,
          email: user?.email,
        }),
      });
      const data = await res.json();
      if (res.ok && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        setErrorMsg(data.message || "Failed to initialize payment.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: 420,
      margin: "40px auto",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 16px rgba(25,118,210,0.10)",
      padding: 32,
      textAlign: "center"
    }}>
      <h1 style={{ color: "#1976d2", marginBottom: 8 }}>Apply for a Course</h1>
      <p style={{ color: "#444", marginBottom: 24 }}>
        To apply for a course, please fill out the application form below.
      </p>
      <form onSubmit={handlePaystack} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <label htmlFor="name" style={{ textAlign: "left", fontWeight: 500 }}>Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          disabled
          style={{
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #bbb",
            marginBottom: 8,
            fontSize: 16,
            background: "#f4f6fa"
          }}
        />

        <label htmlFor="email" style={{ textAlign: "left", fontWeight: 500 }}>Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          disabled
          style={{
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #bbb",
            marginBottom: 8,
            fontSize: 16,
            background: "#f4f6fa"
          }}
        />

        <label htmlFor="courseId" style={{ textAlign: "left", fontWeight: 500 }}>Course:</label>
        <select
          id="courseId"
          name="courseId"
          value={form.courseId}
          onChange={handleChange}
          required
          style={{
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #bbb",
            marginBottom: 16,
            fontSize: 16,
            background: "#f4f6fa"
          }}
        >
          <option value="">Select a course</option>
          {coursesLoading ? (
            <option disabled>Loading courses...</option>
          ) : (
            courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.course}
              </option>
            ))
          )}
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "12px 0",
            fontWeight: 600,
            fontSize: 17,
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: 8,
            transition: "background 0.2s"
          }}
        >
          {loading ? "Redirecting to Paystack..." : "Proceed to Paystack"}
        </button>
        {successMsg && <div style={{ color: "green", marginTop: 10 }}>{successMsg}</div>}
        {errorMsg && <div style={{ color: "red", marginTop: 10 }}>{errorMsg}</div>}
      </form>
    </div>
  );
};

export default Apply;