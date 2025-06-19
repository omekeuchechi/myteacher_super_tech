import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/authstyles/register.css';
import googleImage from '../assets/images/google.png';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const coursesDataValues = [
  {id: 1, courseName: "Front-End Development", color: "orange", textcl: "#fff"},
  {id: 2, courseName: "Backend Programming", color: "blue", textcl: "#fff"},
  {id: 3, courseName: "Power BI", color: "gold", textcl: "#fff"},
  {id: 4, courseName: "Content Creation & Social Media Marketing", color: "green", textcl: "#fff"},
  {id: 5, courseName: "Data Entry", color: "black", textcl: "#fff"},
  {id: 6, courseName: "Virtual Assistant", color: "#1a73e8", textcl: "#fff",},
  {id: 7, courseName: "Basic Computing", color: "blue", textcl: "#fff"},
  {id: 8, courseName: "Copy Writing", color: "green", textcl: "#fff"},
  {id: 9, courseName: "Mobile App Development", color: "blue", textcl: "#fff"},
  {id: 10, courseName: "Generative AI", color: "red", textcl: "#fff"},
  {id: 11, courseName: "Project Management", color: "violet", textcl: "#fff"},
  {id: 12, courseName: "Graphics Design", color: "green", textcl: "#fff"},
  {id: 13, courseName: "UI/UX Design", color: "orange", textcl: "#fff"},
  {id: 14, courseName: "Full Stack Development", color: "red", textcl: "#fff"},
  {id: 15, courseName: "Cyber Security", color: "blue", textcl: "#fff"},
  {id: 16, courseName: "Data Analytics", color: "gold", textcl: "#fff"},
  {id: 17, courseName: "SQL Database", color: "blue", textcl: "#fff"},
  {id: 18, courseName: "Python for Data Analysis", color: "gold", textcl: "#fff"},
  {id: 19, courseName: "Excel for Data Analysis", color: "green", textcl: "#fff"},
  {id: 20, courseName: "Digital Marketing", color: "red", textcl: "#fff"},
];

const Register = () => {
  const [course, setCourse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/user/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/user/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userCourse: course }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        navigate('/verify-email-info');
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (err) {
      setMessage('Network error');
    }
    setLoading(false);
  };

  return(
    <>
      {loading && (
        <div className="register-loading-overlay">
          <div className="register-spinner"></div>
        </div>
      )}
      <div className="overlay-bg"></div>
      <div className="authentication-container">
        <div className="authentication-header">
          <h1>Create Account</h1>
        </div>

        <div className="other-auth">
            <button type="button" onClick={handleGoogleLogin}>
              <img src={googleImage} alt="google auth" /> Sign in with Google
            </button>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="FullName">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="Password">Password</label>
            <div className="password-wrapper" style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span className='eyes' onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </span>
            </div>

            <input type="hidden" value={course} />
            <label htmlFor="course">choose course by clicking</label>

            <div className="courses-section">
              {coursesDataValues.map((data) => (
                <span className="cr-value"
                  onClick={() => setCourse(data.courseName)}
                  key={data.id}
                  style={{
                    color: `${course === data.courseName ? '#000' : data.textcl}`,
                    backgroundColor: `${course === data.courseName ? '#fff' : data.color}`,
                    cursor: 'pointer',
                  }}>
                  {course === data.courseName ? `✅ ${data.courseName}` : data.courseName}
                </span>
              ))}
            </div>

            <Link className='aha' to="/login">Already have an account?</Link>

            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Get Started"}
            </button>
            {message && <div style={{ color: 'red', marginTop: 10 }}>{message}</div>}
          </form>
        </div>
      </div>
      <style>{`
        .register-loading-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.3);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .register-spinner {
          border: 6px solid #f3f3f3;
          border-top: 6px solid #1976d2;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </>
  );
}

export default Register;