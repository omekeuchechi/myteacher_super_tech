import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/authstyles/auth.css';
import '../assets/styles/authstyles/res.css';
import myteacherLogo from '../img/Untitled-1.png';
import illusOne from '../assets/illustrations/Nerd-amico.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Register = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  }

  const handleNext = () => {
    if (step < 2) {
      setStep(prev => prev + 1);
    } else {
      // Handle form submission here if needed
      // Example: navigate('/nextPage');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div className='auth-container'>
      <div className='side-background'>
        <h1>Myteacher Registration</h1>
        <p>Join us and start your journey with Myteacher.</p>
        <img src={illusOne} alt="illustration image" />
      </div>
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
              <img src={myteacherLogo} alt="logo" style={{cursor: 'pointer'}} onClick={handleHomeClick} />
              <span>Get Start</span>
            </div>
            <h2>Full Name</h2>
            <input className='input' placeholder='Full Name' />
            <h2>Email</h2>
            <input className='input' placeholder='Email' />
            <h2>Phone</h2>
            <input className='input' placeholder='Phone' />
            <div className="arg">
              <a href="">already have an account</a>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className='step'>
            <div>
              <img src={myteacherLogo} alt="logo" />
              <span>User Info</span>
            </div>
            <h2>Address</h2>
            <input className='input' placeholder='Address...' />
            <h2>State Of Origin</h2>
            <input className='input' placeholder='State Of Origin' />
            <h2>Age</h2>
            <input className='input' placeholder='Age' type='number' />
            <div className="arg">
              <a href="">already have an account</a>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className='step'>
            <div>
              <img src={myteacherLogo} alt="logo" />
              <span>Auth</span>
            </div>
            <h2>Password</h2>
            <input className='input' placeholder='password' type='password' />
            <h2>Confirm Password</h2>
            <input className='input' placeholder='Confirm Password' type='password' />
            <button className='submit-btn'>Get Started</button>
            <div className="arg">
            {/* <label style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', width: '100%' }}>
              <input type="checkbox" style={{ minWidth: 18, minHeight: 18 }} />
              <span style={{ fontSize: '1rem', lineHeight: 1.3 }}>
                By clicking you accept the <a href="" style={{ textDecoration: 'underline', color: '#4a90e2' }}>Terms and conditions</a>
              </span>
            </label> */}
            <a href="">already have an account?</a>
            </div>
          </div>
        </div>
        {/* Navigation Buttons */}
        <div className='buttons'>
          {step > 0 && (
            <button onClick={handleBack}>Back</button>
          )}
          <button onClick={handleNext}>{step < 2 ? 'Next' : 'Finish'}</button>
        </div>
      </div>
    </div>
  );
};

export default Register;