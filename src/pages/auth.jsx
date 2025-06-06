import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/authstyles/register.css';
import googleImage from '../assets/images/google.png';

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
  const [course, setcourse] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return(
    <>
    <div className="overlay-bg"></div>
    <div className="authentication-container">
      <div className="authentication-header">
        <h1>Create Account</h1>
      </div>

      <div className="other-auth">
        <button><img src={googleImage} alt="google auth" /> Sign Up with Google</button>
      </div>

      <h2 style={{ color: '#fff', fontSize: '3rem', zIndex: 4, marginBottom: '10px', fontFamily: 'monospace' }}>Or</h2>


      <div className="form-container">
        <form action="" method="post">
          <label htmlFor="FullName">Full Name</label>
          <input type="text" />
          <label htmlFor="Email">Email</label>
          <input type="email" />
          <label htmlFor="Password">Password</label>
          <div className="password-wrapper" style={{ position: 'relative' }}>
            <input type={showPassword ? "text" : "password"} />
            <span className='eyes' onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
              <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
            </span>
          </div>

          <input type="hidden" value={course} />
          <label htmlFor="course">choose course by clicking</label>

          <div className="courses-section">
            {coursesDataValues.map((data) => (
            <span className="cr-value" 
              onClick={() => setcourse(data.courseName)} 
              key={data.id} 
              style={{ color: `${course == data.courseName ? '#000' : `${data.textcl}`}`, 
                       backgroundColor: `${course == data.courseName ? '#fff' : `${data.color}` }`,
                       cursor: 'pointer',
             }}> 
                {course == data.courseName ? `✅ ${data.courseName}` : `${data.courseName}`}
            </span>
            ))}
          </div>

          <Link className='aha' to="/login">Already have an account?</Link>

          <button type="submit">Get Started</button>
        </form>
      </div>
      
    </div>
    </>
  );
}

export default Register;
