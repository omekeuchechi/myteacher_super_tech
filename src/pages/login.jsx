import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/authstyles/auth.css';
import '../assets/styles/authstyles/res.css';
import myteacherLogo from '../img/Untitled-1.png';
import illusOne from '../assets/illustrations/Nerd-amico.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Login = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleNext = (e) => {
    e.preventDefault();
    // Handle login logic here
    // Example: if (email && password) { navigate('/dashboard'); }
    // For now, just navigate to home
    navigate('/');
  };

  return (
    <div className='auth-container'>
      <div className='side-background'>
        <h1>Myteacher Login</h1>
        <p>Welcome back! Please login to your account.</p>
        <img src={illusOne} alt="illustration" />
      </div>
      <div className='sliding-form'>
        <form className='slider' onSubmit={handleNext}>
          <div className='step'>
            <div>
              <img
                src={myteacherLogo}
                alt="logo"
                style={{ cursor: 'pointer' }}
                onClick={handleHomeClick}
              />
              <span>Login</span>
            </div>
            <h2>Email</h2>
            <input
              className='input'
              placeholder='Email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <h2>Password</h2>
            <input
              className='input'
              placeholder='Password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button className='submit-btn' type='submit'>Login</button>
            <div className="arg">
              <span>
                Don't have an account?{' '}
                <a href="/auth" style={{ textDecoration: 'underline', color: '#4a90e2' }}>
                  Register
                </a>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;