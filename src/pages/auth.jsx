import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/authstyles/auth.css';
import '../assets/styles/authstyles/res.css';
import myteacherLogo from '../img/Untitled-1.png';

// Images
import illus1 from '../assets/illustrations/dashboard/myteacher_institute_illustration1.jpg';
import illus2 from '../assets/illustrations/dashboard/myteacher_institute_illustration2.jpg';
import illus3 from '../assets/illustrations/dashboard/myteacher_institute_illustration3.jpg';
import illus4 from '../assets/illustrations/dashboard/myteacher_institute_illustration4.jpg';
import illus5 from '../assets/illustrations/dashboard/myteacher-graphic-designer.jpg';

const images = [illus1, illus2, illus3, illus4, illus5];

const Register = () => {
  const [step, setStep] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setBgIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 2000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleNext = () => {
    if (step < 2) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
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
        <div
          className='slider'
          style={{
            transform: `translateX(-${step * 100}%)`,
          }}
        >
          {/* Step 1 */}
          <div className='step'>
            <div>
              <img
                src={myteacherLogo}
                alt='logo'
                style={{ cursor: 'pointer' }}
                onClick={handleHomeClick}
              />
              <span>Get Start</span>
            </div>
            <h2>Full Name</h2>
            <input className='input' placeholder='Full Name' />
            <h2>Email</h2>
            <input className='input' placeholder='Email' />
            <h2>Phone</h2>
            <input className='input' placeholder='Phone' />
            <div className='arg'>
              <a href=''>already have an account</a>
            </div>
          </div>

          {/* Step 2 */}
          <div className='step'>
            <div>
              <img src={myteacherLogo} alt='logo' />
              <span>User Info</span>
            </div>
            <h2>Address</h2>
            <input className='input' placeholder='Address...' />
            <h2>State Of Origin</h2>
            <input className='input' placeholder='State Of Origin' />
            <h2>Age</h2>
            <input className='input' placeholder='Age' type='number' />
            <div className='arg'>
              <a href=''>already have an account</a>
            </div>
          </div>

          {/* Step 3 */}
          <div className='step'>
            <div>
              <img src={myteacherLogo} alt='logo' />
              <span>Auth</span>
            </div>
            <h2>Password</h2>
            <input className='input' placeholder='password' type='password' />
            <h2>Confirm Password</h2>
            <input className='input' placeholder='Confirm Password' type='password' />
            <button className='submit-btn-reg'>Get Started</button>
            <div className='arg'>
              <a href=''>already have an account?</a>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className='buttons'>
          {step > 0 && <button onClick={handleBack}>Back</button>}
          <button
            onClick={handleNext}
            style={{
              borderTopRightRadius: step < 2 ? '30px' : '0px',
              borderBottomRightRadius: step < 2 ? '30px' : '0px',
            }}
          >
            {step < 2 ? 'Next' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
