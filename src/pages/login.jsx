import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../assets/styles/authstyles/register.css';
import googleImage from '../assets/images/google.png';
import { AuthContext } from '../../context/Authcontext';

const API_BASE = import.meta.env.VITE_BASEURL;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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
      const res = await fetch(`${API_BASE}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.user && data.token) {
        // Save token for authenticated requests
        localStorage.setItem('token', data.token);
        login(data.user); // This sets expiry in AuthContext
        setMessage('');
        // Redirect to the originally intended page, or dashboard/admin dashboard
        const redirectTo =
          location.state?.from?.pathname ||
          (data.user.isVerified && data.user.isAdmin
            ? '/admin/dashboard'
            : data.user.isVerified && !data.user.isAdmin
            ? '/dashboard'
            : '/login');
        navigate(redirectTo, { replace: true });
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch {
      setMessage('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="authentication-container">
      {loading && (
        <div className="register-loading-overlay">
          <div className="register-spinner"></div>
        </div>
      )}
      <div className="authentication-header">
        <h1>Welcome Back</h1>
      </div>

      <div className="other-auth">
        <button type="button" onClick={handleGoogleLogin}>
          <img src={googleImage} alt="google auth" /> Sign in with Google
        </button>
      </div>

      <h2 style={{ color: '#fff', fontSize: '3rem', zIndex: 4, marginBottom: '10px', fontFamily: 'monospace' }}>Or</h2>

      <div className="overlay-bg"></div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
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

          <div className="form-links">
            <div className="reb">
              <input type="checkbox" />
              <p style={{ color: 'black', fontSize: '1.4rem', fontFamily: 'monospace' }}>Remember me</p>
            </div>
            <Link to="/forgot-password" className="forgot-password-link" style={{ fontSize: '1.4rem', fontFamily: 'monospace' }}>Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading} className='auth-button'>
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && <div style={{ color: 'red', marginTop: 10, fontSize: '1.4rem', fontFamily: 'monospace' }}>{message}</div>}

          <p className="switch-auth-link" style={{ fontSize: '1.4rem', fontFamily: 'monospace' }}>
            Don't have an account? <Link to="/auth">Create one</Link>
          </p>
        </form>
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
    </div>
  );
};

export default Login;