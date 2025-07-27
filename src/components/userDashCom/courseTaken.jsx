import { useRef, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import '../../assets/styles/dashboard/courseTaken.css';
import ProgressBar from './progressBar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthContext } from '../../../context/Authcontext';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000";

const CourseTaken = ({ theme }) => {
  const { user } = useContext(AuthContext);
  const [isViewAll, setIsViewAll] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token || !user) {
          console.error('Missing authentication data');
          throw new Error('No authentication data found. Please log in again.');
        }

        const response = await fetch(`${API_BASE}/certificates/student/results`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        const responseData = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
          }
          throw new Error(responseData.message || 'Failed to fetch course data');
        }

        // Handle the nested certificates array in the response
        const certificates = responseData.data?.certificates || [];
        
        if (certificates.length > 0) {
          // Flatten all certScores from all certificates
          const allScores = certificates.flatMap(cert => 
            (cert.certScores || []).map(score => ({
              ...score,
              certificateId: cert._id
            }))
          );

          const formattedCourses = allScores.map((score, index) => {
            const lecture = score.lecture || {};
            const grade = calculateGrade(score.score);
            
            return {
              id: score._id || `course-${index}`,
              title: lecture.name || `Course ${index + 1}`,
              description: `Score: ${score.score} - ${grade}`,
              instructor: 'MyTeacher',
              progress: score.score || 0,
              color: getRandomColor(),
              graded: true, // All these are graded since they're from certScores
              submittedAt: score.issuedAt 
                ? new Date(score.issuedAt).toLocaleDateString() 
                : 'N/A',
              certificateIssued: score.certificateIssued || false,
              lectureId: lecture._id,
              rawData: score
            };
          });

          setCourses(formattedCourses);
          setError(null);
        } else {
          setCourses([]);
          setError('No course data available');
        }
      } catch (err) {
        console.error('Error in fetchCourses:', err);
        const errorMessage = err.message || 'Failed to load course data. Please try again later.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  // Helper function to calculate grade based on score
  const calculateGrade = (score) => {
    if (score >= 90) return 'A+ (Distinction)';
    if (score >= 80) return 'A (Excellent)';
    if (score >= 70) return 'B+ (Very Good)';
    if (score >= 60) return 'B (Good)';
    if (score >= 50) return 'C (Satisfactory)';
    return 'D (Pass)';
  };

  const getRandomColor = () => {
    const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleViewToggle = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollLeft = isViewAll ? 0 : container.scrollWidth;
    }
    setIsViewAll(!isViewAll);
  };

  const scrollByCard = (direction) => {
    const container = containerRef.current;
    if (container) {
      const cardWidth = 265;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;
  if (courses.length === 0) return <div className="no-courses">No courses found</div>;

  return (
    <div className={theme === 'dark' ? "dash-course-taken-section dark" : "dash-course-taken-section"}>
      <div className={theme === 'dark' ? "dash-course-taken-header dark" : "dash-course-taken-header"}>
        <h2>My Course Progress</h2>
        <button className="view-all-btn" onClick={handleViewToggle}>
          {isViewAll ? 'View less' : 'View all'}
        </button>
      </div>

      <div className={theme === 'dark' ? "carousel-controls dark" : "carousel-controls"}>
        <button onClick={() => scrollByCard('left')} className="carousel-arrow">
          <i className="fas fa-chevron-left"></i>
        </button>
        <button onClick={() => scrollByCard('right')} className="carousel-arrow">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div
        ref={containerRef}
        className={theme === 'dark' ? "carousel-container dark" : "carousel-container"}
      >
        {courses.map((course) => (
          <div
            key={course.id}
            className={theme === 'dark' ? "dash-course dark" : "dash-course"}
            style={{ '--course-color': course.color }}
          >
            <div className={theme === 'dark' ? "dash-course-header dark" : "dash-course-header"}>
              {course.title}
              {course.graded && <span className="graded-badge">Graded</span>}
              {course.certificateIssued && <span className="certificate-badge">Certificate</span>}
            </div>
            <div className={theme === 'dark' ? "course-content dark" : "course-content"}>
              <p className="course-description">{course.description}</p>
              <div className={theme === 'dark' ? "course-meta dark" : "course-meta"}>
                <span className="instructor">Instructor: {course.instructor}</span>
                <span className="submission-date">Completed: {course.submittedAt}</span>
              </div>
              <div className={theme === 'dark' ? "progress-section dark" : "progress-section"}>
                <ProgressBar progress={course.progress} color={course.color} />
                <span className={theme === 'dark' ? "progress-text dark" : "progress-text"}>
                  {course.progress}% Complete
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseTaken;