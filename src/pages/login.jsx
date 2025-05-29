import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/styles/authstyles/auth.css';
import '../assets/styles/authstyles/res.css';
import myteacherLogo from '../img/Untitled-1.png';

// Images
import myTeacherInstituteIllustration1 from "../assets/illustrations/dashboard/myteacher_institute_illustration1.jpg";
import myTeacherInstituteIllustration2 from "../assets/illustrations/dashboard/myteacher_institute_illustration2.jpg";
import myTeacherInstituteIllustration3 from "../assets/illustrations/dashboard/myteacher_institute_illustration3.jpg";
import myTeacherInstituteIllustration4 from "../assets/illustrations/dashboard/myteacher_institute_illustration4.jpg";
import myTeacherInstituteIllustration5 from "../assets/illustrations/dashboard/myteacher-graphic-designer.jpg";

const images = [
  myTeacherInstituteIllustration1,
  myTeacherInstituteIllustration2,
  myTeacherInstituteIllustration3,
  myTeacherInstituteIllustration4,
  myTeacherInstituteIllustration5,
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bgIndex, setBgIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true);
      }, 2000); // slow fade transition
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleHomeClick = () => navigate('/');
  const handleNext = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className='auth-container'>
      <div
        className={`side-background ${fade ? 'fade-in' : 'fade-out'}`}
        style={{
          backgroundImage: `url(${images[bgIndex]})`,
        }}
      />
      
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
                <Link to="/auth" style={{ textDecoration: 'underline', color: '#4a90e2' }}>
                  Register
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
