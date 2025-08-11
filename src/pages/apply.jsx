import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/Authcontext';
import { CourseContext } from '../../context/CourseContext';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/nav';
import FooterFd from '../components/fd/Footer';
import '../assets/styles/styles.css';
import welcomeImage from '../img/Untitled-1.png';
import { Modal, Box, Typography, Button } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  textAlign: 'center',
};

const API_BASE = import.meta.env.VITE_BASEURL;

const Apply = () => {
  const { user } = useContext(AuthContext);
  const [upcomingLectures, setUpcomingLectures] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openWelcomeModal, setOpenWelcomeModal] = useState(true);

  useEffect(() => {
    const fetchUpcomingLectures = async () => {
      try {
        const response = await axios.get(`${API_BASE}/upcomingLectureBatch`);
        setUpcomingLectures(response.data);
      } catch (error) {
        console.error('Failed to fetch upcoming lectures:', error);
        toast.error('Could not load upcoming lectures.');
      }
    };
    fetchUpcomingLectures();
  }, []);

  const handleBuyCourseClick = (lecture) => {
    setSelectedCourse({
      id: lecture.courseId,
      name: lecture.courseName,
    });
    setShowApplicationForm(true);
  };

  const handleCancel = () => {
    setShowApplicationForm(false);
    setSelectedCourse(null);
  };

  return (
    <>
      <Nav />
      <Modal
        open={openWelcomeModal}
        onClose={() => setOpenWelcomeModal(false)}
        aria-labelledby="welcome-modal-title"
        aria-describedby="welcome-modal-description"
      >
        <Box sx={modalStyle}>
          <img 
            src={welcomeImage} 
            alt="Welcome to our courses" 
            style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }}
          />
          <Typography id="welcome-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Welcome to Our Courses!
          </Typography>
          <Typography id="welcome-modal-description" sx={{ mb: 3 }}>
            Join one of the upcoming online Live courses or enroll for an upcoming course.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setOpenWelcomeModal(false)}
            sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
          >
            Explore Courses
          </Button>
        </Box>
      </Modal>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <UpcomingLecturesList 
          lectures={upcomingLectures} 
          onBuyCourse={handleBuyCourseClick} 
          user={user} 
        />
        <div style={{ flex: 1, width: '100%' }}>
          {showApplicationForm ? (
            <ApplicationForm 
              user={user} 
              course={selectedCourse} 
              onCancel={handleCancel} 
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', background: '#f4f6fa', borderRadius: '12px' }}>
              <h2>Select a Course</h2>
              <p style={{ color: '#444', marginBottom: 24, fontSize: 16 }}>Please select a course from the upcoming lectures list to proceed with your application.</p>
            </div>
          )}
        </div>
      </div>
      <FooterFd />
    </>
  );
};

const UpcomingLecturesList = ({ lectures, onBuyCourse, user }) => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleBookCourse = async (lectureId) => {
    if (!user) {
      toast.info('Please log in to book a course.');
      navigate('/login');
      return;
    }
    try {
      await axios.patch(`${API_BASE}/upcomingLectureBatch/${lectureId}/book`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Course booked successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book course.');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
      <h2 style={{ margin: '20px auto', display: 'flex', alignItems: 'center', gap: '10px' }}><i className='fa-solid fa-book'></i> Upcoming Lectures</h2>
      {lectures.length > 0 ? lectures.map(lecture => {
        const isLectureActive = new Date(lecture.startTime) > new Date();
        const isBooked = user && user._id && lecture.booked && Array.isArray(lecture.booked) && lecture.booked.includes(user._id);

        return (
          <div key={lecture._id} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.1)', padding: '20px' }}>
            <img src={lecture.courseImage} alt={lecture.courseName} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
            <h3 style={{ marginTop: '15px' }}>{lecture.courseName}</h3>
            <p><strong>Instructor:</strong> {lecture.courseInstructor}</p>
            <p><strong>Starts:</strong> {new Date(lecture.startTime).toLocaleString()}</p>
            <p><strong>Platform:</strong> {lecture.platform}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              {isBooked ? (
                <button style={{...buttonStyle(false), flex: 1}} disabled>
                  Booked
                </button>
              ) : (
                <button 
                  onClick={() => handleBookCourse(lecture._id)} 
                  style={buttonStyle(true, hoveredButton === lecture._id)} 
                  onMouseEnter={() => setHoveredButton(lecture._id)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  Book Course
                </button>
              )}
              {user && !isLectureActive && (
                <button 
                  onClick={() => onBuyCourse(lecture)} 
                  style={buttonStyle(true, hoveredButton === `buy-${lecture._id}`)} 
                  onMouseEnter={() => setHoveredButton(`buy-${lecture._id}`)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  Buy Course
                </button>
              )}
            </div>
          </div>
        );
      }) : <p style={{ color: '#444', marginBottom: 24, fontSize: 16 }}>No upcoming lectures at the moment.</p>}
    </div>
  );
};

const ApplicationForm = ({ user, course, onCancel }) => {
  const { courses, loading: coursesLoading } = useContext(CourseContext);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', courseId: course?.id || '', courseName: course?.name || '' });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setForm(prev => ({ ...prev, courseId: course?.id || '', courseName: course?.name || '' }));
  }, [course]);

  const handlePaystack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to continue');
      }

      const response = await axios.post(
        `${API_BASE}/transaction/pay/paystack`,
        {
          userId: user._id,
          courseId: form.courseId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error('Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMsg(error.response?.data?.message || error.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={formContainerStyle}>
      <h1 style={{ color: '#1976d2', marginBottom: 8 }}>Apply for: {course.name}</h1>
      <p style={{ color: '#444', marginBottom: 24 }}>Please confirm your details to proceed.</p>
      <form onSubmit={handlePaystack} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <label htmlFor='name' style={labelStyle}>Name:</label>
        <input type='text' id='name' value={form.name} required disabled style={inputStyle} />

        <label htmlFor='email' style={labelStyle}>Email:</label>
        <input type='email' id='email' value={form.email} required disabled style={inputStyle} />

        <label htmlFor='courseName' style={labelStyle}>Course:</label>
        <input type='text' id='courseName' value={form.courseName} required disabled style={inputStyle} />
        <input type='hidden' name='courseId' value={form.courseId} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button type='button' onClick={onCancel} style={{ ...buttonStyle(true), background: '#888' }}>Cancel</button>
          <button type='submit' disabled={loading} style={buttonStyle(!loading)}>
            {loading ? 'Redirecting...' : 'Proceed to Paystack'}
          </button>
        </div>
        {successMsg && <div style={{ color: 'green', marginTop: 10 }}>{successMsg}</div>}
        {errorMsg && <div style={{ color: 'red', marginTop: 10 }}>{errorMsg}</div>}
      </form>
    </div>
  );
};

const formContainerStyle = {
  maxWidth: 500,
  margin: '0 auto',
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 2px 16px rgba(25,118,210,0.10)',
  padding: 32,
  textAlign: 'center',
  marginTop: '30px',
};

const labelStyle = { textAlign: 'left', fontWeight: 500 };

const inputStyle = {
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid #bbb',
  fontSize: 16,
  background: '#f4f6fa',
  cursor: 'not-allowed'
};

const buttonStyle = (active, isHovered) => ({
  background: active ? (isHovered ? '#1565c0' : '#1976d2') : '#ccc',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '10px 20px',
  fontWeight: 600,
  fontSize: 16,
  cursor: active ? 'pointer' : 'not-allowed',
  transition: 'background 0.2s',
  flex: 1
});

export default Apply;