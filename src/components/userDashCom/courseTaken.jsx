import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/styles/dashboard/courseTaken.css';
import ProgressBar from './progressBar';
import '@fortawesome/fontawesome-free/css/all.min.css';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const CourseTaken = ({theme}) => {
  const [isViewAll, setIsViewAll] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE}/certificates/student/results`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.success && response.data.results) {
          // Transform the API response to match our course structure
          const formattedCourses = response.data.results.map((result, index) => ({
            id: index + 1,
            title: result.assignmentName || `Assignment ${index + 1}`,
            description: result.correction || 'No feedback available',
            instructor: 'Instructor',
            progress: result.score || 0,
            color: getRandomColor(),
            graded: result.graded,
            submittedAt: new Date(result.submittedAt).toLocaleDateString()
          }));
          setCourses(formattedCourses);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getRandomColor = () => {
    const colors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleViewToggle = () => {
    const container = containerRef.current;
    if (container) {
      if (!isViewAll) {
        container.scrollLeft = container.scrollWidth;
      } else {
        container.scrollLeft = 0;
      }
    }
    setIsViewAll(!isViewAll);
  };

  const scrollByCard = (direction) => {
    const container = containerRef.current;
    if (container) {
      const cardWidth = 265; // 250px + 15px margin
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
            </div>
            <div className={theme === 'dark' ? "course-content dark" : "course-content"}>
              <p className="course-description">{course.description}</p>
              <div className={theme === 'dark' ? "course-meta dark" : "course-meta"}>
                <span className="instructor">Instructor: {course.instructor}</span>
                <span className="submission-date">Submitted: {course.submittedAt}</span>
              </div>
              <div className={theme === 'dark' ? "progress-section dark" : "progress-section"}>
                <ProgressBar progress={course.progress} color={course.color} />
                <span className={theme === 'dark' ? "progress-text dark" : "progress-text"}>{course.progress}% Complete</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseTaken;