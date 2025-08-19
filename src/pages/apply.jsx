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
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';

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
      linkedLecture: lecture.linkedLecture,
      courseName: lecture.courseName
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
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [openEnrollmentModal, setOpenEnrollmentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { fetchCourses } = useContext(CourseContext);

  const handleBookCourse = (lecture) => {
    if (!user) {
      toast.info('Please log in to book a course.');
      navigate('/login');
      return;
    }
    
    // Set enrollment details and open modal
    setEnrollmentDetails({
      userId: user._id,
      lectureId: lecture._id,
      linkedLecture: lecture.linkedLecture,
      courseImage: lecture.courseImage,
      courseName: lecture.courseName,
      instructor: lecture.courseInstructor,
      startTime: lecture.startTime
    });
    setOpenEnrollmentModal(true);
  };

  const handleConfirmEnrollment = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Call the free-lecture API
      await axios.post(
        `${API_BASE}/transaction/free-lecture`,
        enrollmentDetails,
        {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Close the modal and show success message
      setOpenEnrollmentModal(false);
      toast.success('Successfully enrolled in the lecture!');
    } catch (error) {
      console.error('Error enrolling in lecture:', error);
      setError(error.response?.data?.message || 'Failed to enroll in the lecture. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
        <h2 style={{ margin: '20px auto', display: 'flex', alignItems: 'center', gap: '10px' }}><i className='fa-solid fa-book'></i> Upcoming Lectures</h2>
        {lectures.length > 0 ? lectures.map(lecture => {
          const isLectureActive = new Date(lecture.startTime) > new Date();

          return (
            <div key={lecture._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ddd', padding: '20px' }}>
              <img src={lecture.courseImage} alt={lecture.courseName} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
              {console.log(lecture)}
              <h3 style={{ marginTop: '15px' }}>{lecture.courseName}</h3>
              <p><strong>Instructor:</strong> {lecture.courseIntructor}</p>
              <p><strong>Starts:</strong> {new Date(lecture.startTime).toLocaleString()}</p>
              <p><strong>Platform:</strong> {lecture.platform}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button 
                  onClick={() => handleBookCourse(lecture)} 
                  style={buttonStyle(true, hoveredButton === lecture._id)} 
                  onMouseEnter={() => setHoveredButton(lecture._id)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  Enroll
                </button>
              </div>
            </div>
          );
        }) : <p style={{ color: '#444', marginBottom: 24, fontSize: 16 }}>No upcoming lectures at the moment.</p>}
      </div>

      {/* Enrollment Confirmation Modal */}
      <Modal
        open={openEnrollmentModal}
        onClose={() => setOpenEnrollmentModal(false)}
        aria-labelledby="enrollment-modal-title"
        aria-describedby="enrollment-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Typography id="enrollment-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Confirm Enrollment
          </Typography>
          
          {enrollmentDetails && (
            <Box sx={{ mt: 2, mb: 3 }}>
              {/* Course Details */}
              <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, color: '#1976d2' }}>COURSE INFORMATION</Typography>
                <div>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <span style={{ color: '#666', minWidth: '100px', display: 'inline-block' }}>Course:</span>
                    <span style={{ fontWeight: 500 }}>{enrollmentDetails.courseName}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <span style={{ color: '#666', minWidth: '100px', display: 'inline-block' }}>Instructor:</span>
                    <span style={{ fontWeight: 500, color: '#1976d2' }}>{enrollmentDetails.courseIntructor}</span>
                  </Typography>
                  <Typography variant="body2">
                    <span style={{ color: '#666', minWidth: '100px', display: 'inline-block' }}>Start Time:</span>
                    <span>{new Date(enrollmentDetails.startTime).toLocaleString()}</span>
                  </Typography>
                </div>
              </Box>

              {/* Enrollment Details */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Enrollment Details</Typography>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#f8f9fa', 
                  borderRadius: 1, 
                  border: '1px solid #e0e0e0',
                  '& > div': { 
                    display: 'flex', 
                    py: 1.5,
                    borderBottom: '1px solid #eee',
                    '&:last-child': { 
                      borderBottom: 'none',
                      pb: 0 
                    }
                  }
                }}>
                  <div>
                    <Typography variant="body2" component="span" sx={{ color: '#666', minWidth: '120px', display: 'inline-block' }}>Student Name:</Typography>
                    <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>{user?.name || 'N/A'}</Typography>
                  </div>
                  <div>
                    <Typography variant="body2" component="span" sx={{ color: '#666', minWidth: '120px', display: 'inline-block' }}>Lecture ID:</Typography>
                    <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace', fontSize: '0.85em' }}>
                      {enrollmentDetails.lectureId}
                    </Typography>
                  </div>
                  {enrollmentDetails.linkedLecture && (
                    <div>
                      <Typography variant="body2" component="span" sx={{ color: '#666', minWidth: '120px', display: 'inline-block' }}>Linked Lecture:</Typography>
                      <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace', fontSize: '0.85em' }}>
                        {enrollmentDetails.linkedLecture}
                      </Typography>
                    </div>
                  )}
                </Box>
              </Box>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, flexDirection: 'column' }}>
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setOpenEnrollmentModal(false);
                  setError('');
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleConfirmEnrollment}
                disabled={isLoading}
                sx={{ 
                  bgcolor: '#1976d2', 
                  '&:hover': { 
                    bgcolor: '#1565c0',
                    '&.Mui-disabled': {
                      bgcolor: '#1976d2'
                    }
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#1976d2',
                    opacity: 0.7
                  }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Confirm Enrollment'
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

const ApplicationForm = ({ user, course, onCancel }) => {
  const { courses, loading: coursesLoading } = useContext(CourseContext);
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    linkedLecture: course?.linkedLecture || '',
    courseName: course?.courseName || '' 
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setForm(prev => ({ 
      ...prev, 
      linkedLecture: course?.linkedLecture || '',
      courseName: course?.courseName || '' 
    }));
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
          courseName: form.courseName, // Using courseName as the primary identifier
          linkedLecture: form.linkedLecture || undefined // Only include if it exists
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
      
      // Show more detailed error if available
      if (error.response?.data?.details) {
        setErrorMsg(prev => `${prev}: ${error.response.data.details}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={formContainerStyle}>
      <h1 style={{ color: '#1976d2', marginBottom: 8 }}>Apply for: {course.courseName}</h1>
      <p style={{ color: '#444', marginBottom: 24 }}>Please confirm your details to proceed.</p>
      <form onSubmit={handlePaystack} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <label htmlFor='name' style={labelStyle}>Name:</label>
        <input type='text' id='name' value={form.name} required disabled style={inputStyle} />

        <label htmlFor='email' style={labelStyle}>Email:</label>
        <input type='email' id='email' value={form.email} required disabled style={inputStyle} />

        <label htmlFor='courseName' style={labelStyle}>Course:</label>
        <input type='text' id='courseName' value={form.courseName} required disabled style={inputStyle} />
        <input type='hidden' name='linkedLecture' value={form.linkedLecture} />

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
  background: active ? (isHovered ? '#1565c0' : '#1e3a8a') : '#ccc',
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