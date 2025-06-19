import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const coursesDataValues = [
  "Front-End Development", "Backend Programming", "Power BI", "Content Creation & Social Media Marketing",
  "Data Entry", "Virtual Assistant", "Basic Computing", "Copy Writing", "Mobile App Development",
  "Generative AI", "Project Management", "Graphics Design", "UI/UX Design", "Full Stack Development",
  "Cyber Security", "Data Analytics", "SQL Database", "Python for Data Analysis", "Excel for Data Analysis", "Digital Marketing"
];

const GoogleSuccess = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("Signing you in...");
  const [user, setUser] = useState(null);
  const [selectingCourse, setSelectingCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");
    setToken(tokenFromUrl);

    if (!tokenFromUrl) {
      setMessage("No token found. Please try logging in again.");
      return;
    }

    // Get user info using /me endpoint with JWT
    fetch(`${API_BASE}/user/me`, {
      headers: {
        "Authorization": `Bearer ${tokenFromUrl}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          setUser(data);
          if (!data.userCourse) {
            setSelectingCourse(true);
            setMessage("Please select your course to continue.");
          } else {
            localStorage.setItem("token", tokenFromUrl);
            login(data);
            if (data.isVerified && data.isAdmin) {
              navigate("/admin/dashboard");
            } else if (data.isVerified && !data.isAdmin) {
              navigate("/dashboard");
            } else {
              navigate("/login");
            }
          }
        } else {
          setMessage("Could not log you in. Please try again.");
        }
      })
      .catch(() => setMessage("Network error. Please try again."));
  }, [location, login, navigate]);

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !user) return;

    try {
      const res = await fetch(`${API_BASE}/user/update-user-course`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ userCourse: selectedCourse }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem("token", token);
        login(data.user);
        setMessage("Course updated. Redirecting...");
        if (data.user.isVerified && data.user.isAdmin) {
          navigate("/admin/dashboard");
        } else if (data.user.isVerified && !data.user.isAdmin) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      } else {
        setMessage(data.message || "Could not update course. Please try again.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    }
  };

  if (selectingCourse && user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", fontSize: 24 }}>
        <div>{message}</div>
        <form onSubmit={handleCourseSubmit} style={{ marginTop: 30 }}>
          <label htmlFor="course" style={{ fontSize: 18 }}>Select your course:</label>
          <select
            id="course"
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            style={{ fontSize: 18, marginLeft: 10 }}
            required
          >
            <option value="">--Choose--</option>
            {coursesDataValues.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          <button type="submit" style={{ marginLeft: 15, fontSize: 18 }}>Continue</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
      {message}
    </div>
  );
};

export default GoogleSuccess;