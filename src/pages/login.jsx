import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/authstyles/register.css';
import googleImage from '../assets/images/google.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="authentication-container">
      <div className="authentication-header">
        <h1>Welcome Back</h1>
      </div>

      <div className="other-auth">
        <button><img src={googleImage} alt="google auth" /> Sign in with Google</button>
      </div>

      <h2 style={{ color: '#fff', fontSize: '3rem', zIndex: 4, marginBottom: '10px', fontFamily: 'monospace' }}>Or</h2>

      <div className="overlay-bg"></div>

      <div className="form-container">
        <form action="" method="post">
          <label htmlFor="Email">Email</label>
          <input type="email" />

          <label htmlFor="Password">Password</label>
          <div className="password-wrapper" style={{ position: 'relative' }}>
            <input type={showPassword ? "text" : "password"} />
            <span className='eyes' onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
              <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
            </span>
          </div>

          <div className="form-links">
            <div className="reb">
            <input type="checkbox" />
            <p>Remember me</p>
            </div>
            <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
          </div>

          <button type="submit">Login</button>

          <p className="switch-auth-link">
            Don't have an account? <Link to="/auth">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
