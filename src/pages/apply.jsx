import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/Authcontext';
import { CourseContext } from '../../context/CourseContext';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/nav';
import FooterFd from '../components/fd/Footer';
import '../assets/styles/dashboard/apply.css';
import welcomeImage from '../img/Untitled-1.png';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',    // On extra small screens
    sm: '80%',     // On small screens
    md: '60%',     // On medium screens
    lg: '50%',     // On large screens
    xl: '400px'    // On extra large screens
  },
  maxWidth: '500px', // Maximum width
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: {
    xs: 2,  // Smaller padding on small screens
    sm: 3,  // Medium padding on larger screens
    md: 4   // Larger padding on desktop
  },
  borderRadius: 2,
  textAlign: 'center',
  maxHeight: '90vh',
  overflowY: 'auto',
  '&:focus': {
    outline: 'none'
  }
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
            className="welcome-modal-image"
          />
          <Typography id="welcome-modal-title" variant="h6" component="h2" className="mb-2">
            Welcome to Our Courses!
          </Typography>
          <Typography id="welcome-modal-description" className="mb-3">
            Join one of the upcoming online Live courses or enroll for an upcoming course.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setOpenWelcomeModal(false)}
            className="btn btn-primary"
          >
            Explore Courses
          </Button>
        </Box>
      </Modal>
      
      <div className="apply-container">
        <UpcomingLecturesList 
          lectures={upcomingLectures} 
          onBuyCourse={handleBuyCourseClick} 
          user={user} 
        />
        <div className="apply-form-section">
          {showApplicationForm ? (
            <ApplicationForm 
              user={user} 
              course={selectedCourse} 
              onCancel={handleCancel} 
            />
          ) : (
            <div className="select-course-prompt">
              <h2>Select a Course</h2>
              <p>Please select a course from the upcoming lectures list to proceed with your application.</p>
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
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { fetchCourses } = useContext(CourseContext);

  const handleBookCourse = (lecture) => {
    if (!user) {
      toast.info('Please log in to book a course.');
      navigate('/login');
      return;
    }
    
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
      
      setOpenEnrollmentModal(false);
      toast.success('Successfully enrolled in the lecture!');
    } catch (error) {
      console.error('Enrollment error:', error);
      setError(error.response?.data?.message || 'Failed to enroll in the lecture');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaidEnrollment = (lecture) => {
    setEnrollmentDetails({
      userId: user._id,
      lectureId: lecture._id,
      linkedLecture: lecture.linkedLecture,
      courseImage: lecture.courseImage,
      courseName: lecture.courseName,
      instructor: lecture.courseInstructor,
      startTime: lecture.startTime
    });
    setShowPaymentForm(true);
  };

  return (
    <>
      <div className="lectures-list">
        <h2 className="lectures-header-title">
          <i className='fa-solid fa-book'></i> Upcoming Lectures
        </h2>
        {lectures.length > 0 ? lectures.map(lecture => {
          const isLectureActive = new Date(lecture.startTime) > new Date();

          return (
            <div key={lecture._id} className="lecture-card">
              <img 
                src={lecture.courseImage} 
                alt={lecture.courseName} 
                className="lecture-image" 
                loading='lazy'
              />
              <h3 className="lecture-title">{lecture.courseName}</h3>
              <p className="lecture-detail"><strong>Instructor:</strong> {lecture.courseIntructor}</p>
              <p className="lecture-detail"><strong>Starts:</strong> {new Date(lecture.startTime).toLocaleString()}</p>
              <p className="lecture-detail"><strong>Platform:</strong> {lecture.platform}</p>
              <div className="lecture-actions">
                <button 
                  onClick={() => handlePaidEnrollment(lecture)}
                  className={`btn btn-primary ${hoveredButton === lecture._id ? 'hover' : ''}`}
                  onMouseEnter={() => setHoveredButton(lecture._id)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          );
        }) : <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '50vh', width: '100%' }}>
          <div style={{ width: '3rem', height: '3rem', color: '#007bff', animation: 'spin 1s linear infinite', borderRadius: '50%', display: 'inline-block', border: '3px solid transparent', borderTopColor: '#007bff', marginBottom: '1rem' }} role="status">
          </div>
      </div>}
      </div>

      {/* Enrollment Confirmation Modal */}
      {openEnrollmentModal && (
        <Modal
          open={openEnrollmentModal}
          onClose={() => setOpenEnrollmentModal(false)}
          aria-labelledby="enrollment-modal-title"
          aria-describedby="enrollment-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="enrollment-modal-title" variant="h6" component="h2">
              Confirm Enrollment
            </Typography>
            <Typography id="enrollment-modal-description" className="mt-3">
              Are you sure you want to enroll in this free lecture?
            </Typography>
            <Box className="form-actions">
              <Button 
                onClick={() => setOpenEnrollmentModal(false)}
                variant="outlined"
                disabled={isLoading}
                className="btn btn-secondary"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmEnrollment}
                variant="contained"
                disabled={isLoading}
                className="btn btn-primary"
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? 'Enrolling...' : 'Confirm'}
              </Button>
            </Box>
            {error && (
              <Typography color="error" className="mt-3">
                {error}
              </Typography>
            )}
          </Box>
        </Modal>
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <Modal
          open={showPaymentForm}
          onClose={() => setShowPaymentForm(false)}
          aria-labelledby="payment-modal-title"
          aria-describedby="payment-modal-description"
        >
          <Box sx={modalStyle}>
            <ApplicationForm 
              user={user} 
              course={enrollmentDetails} 
              onCancel={() => setShowPaymentForm(false)} 
            />
          </Box>
        </Modal>
      )}
    </>
  );
};

const ApplicationForm = ({ user, course, onCancel }) => {
  const { courses, loading: coursesLoading } = useContext(CourseContext);
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    phone: user?.phone || '',
    linkedLecture: course?.linkedLecture || '',
    courseName: course?.courseName || '',
    courseId: course?.lectureId || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setForm(prev => ({ 
      ...prev, 
      linkedLecture: course?.linkedLecture || '',
      courseName: course?.courseName || '',
      courseId: course?.lectureId || '',
      name: user?.name || prev.name,
      email: user?.email || prev.email,
      phone: user?.phone || prev.phone
    }));
  }, [course, user]);

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

      let courseToEnroll = null;
      if (form.courseId) {
        try {
          const response = await axios.get(
            `${API_BASE}/courses/${form.courseId}`,
            { 
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              } 
            }
          );
          
          if (response.data.success && response.data.data) {
            courseToEnroll = response.data.data;
          } else {
            console.log('Course not found by ID, trying by name...');
          }
        } catch (error) {
          console.log('Error fetching course by ID:', error);
        }
      }

      if (!courseToEnroll && form.courseName) {
        try {
          const response = await axios.get(
            `${API_BASE}/courses?name=${encodeURIComponent(form.courseName)}`,
            { 
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              } 
            }
          );
          
          if (response.data.success && response.data.data && response.data.data.length > 0) {
            courseToEnroll = response.data.data[0];
          }
        } catch (error) {
          console.error('Error fetching courses by name:', error);
        }
      }

      if (!courseToEnroll) {
        throw new Error('Course not found. Please contact support for assistance.');
      }

      const response = await axios.post(
        `${API_BASE}/transaction/pay/paystack`,
        {
          userId: user._id,
          courseId: courseToEnroll._id,
          courseName: courseToEnroll.course || form.courseName,
          linkedLecture: form.linkedLecture || undefined
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
      
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-form-container">
      <h1 className="apply-form-title">Apply for: {form.courseName}</h1>
      <p className="apply-form-description">Please confirm your details to proceed.</p>

      <div className="form-group">
        <p className="form-detail">Name: <span>{form.name}</span></p>
        <p className="form-detail">Course Name: <span>{form.courseName}</span></p>
        <p className="form-detail">Email: <span>{form.email}</span></p>
        <p className="form-detail">Linked Lecture: <span>{form.linkedLecture}</span></p>
      </div>
      
      <form onSubmit={handlePaystack} className="apply-form">
        <input type="hidden" id="name" value={form.name} required disabled />
        <input type="hidden" id="email" value={form.email} required disabled />
        <input type="hidden" id="courseName" value={form.courseName} required disabled />
        <input type="hidden" name="linkedLecture" value={form.linkedLecture} />
        <input type="hidden" name="courseId" value={form.courseId} />

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Processing...' : 'Proceed to Paystack'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
        
        {successMsg && <div className="success-message">{successMsg}</div>}
        {errorMsg && <div className="error-message">{errorMsg}</div>}
      </form>
    </div>
  );
};

export default Apply;