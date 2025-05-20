import { useRef, useState } from 'react';
import '../../assets/styles/dashboard/courseTaken.css';
import ProgressBar from './progressBar';
import '@fortawesome/fontawesome-free/css/all.min.css';

const CourseTaken = () => {
  const [isViewAll, setIsViewAll] = useState(false);
  const containerRef = useRef(null);

  const courses = [
    { id: 1, title: 'MERN STACK', description: 'Web Development with MongoDB, Express.js, React, Node.js', instructor: 'Richard', progress: 60, color: 'green' },
    { id: 2, title: 'Python Basics', description: 'Learn Python fundamentals', instructor: 'Alice', progress: 45, color: '#FF5733' },
    { id: 3, title: 'UI and UX with Figma Design', description: 'Design user-friendly interfaces', instructor: 'Bob', progress: 80, color: 'orange' },
    { id: 4, title: 'Data Science with Python', description: 'Analyze data and build models', instructor: 'Sara', progress: 50, color: '#3399FF' },
    { id: 5, title: 'React Native Mobile App', description: 'Build mobile apps with React Native', instructor: 'James', progress: 30, color: '#00BFFF' },
    { id: 6, title: 'Cybersecurity Essentials', description: 'Learn about protecting systems', instructor: 'DaviD', progress: 70, color: '#800080' },
    { id: 7, title: 'Machine Learning', description: 'Build intelligent algorithms', instructor: 'Emma', progress: 55, color: '#FF69B4' },
    { id: 8, title: 'Blockchain Basics', description: 'Understand blockchain technology', instructor: 'Liam', progress: 40, color: '#8A2BE2' },
    { id: 9, title: 'JavaScript Fundamentals', description: 'Master JavaScript core concepts', instructor: 'Olivia', progress: 65, color: '#FFD700' },
    { id: 10, title: 'Cloud Computing', description: 'Learn AWS and cloud services', instructor: 'Mike', progress: 35, color: '#4682B4' },
  ];

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

  return (
    <div className="dash-course-taken-section">
      {/* Header */}
      <div
        className="dash-course-taken-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h2>Current Running Courses</h2>
        <button className="view-all-btn" onClick={handleViewToggle}>
          {isViewAll ? 'View less' : 'View all'}
        </button>
      </div>

      {/* Arrow buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
        <button
          onClick={() => scrollByCard('left')}
          style={{ marginRight: '10px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
        >
          <i className="fas fa-chevron-left clor"></i>
        </button>
        <button
          onClick={() => scrollByCard('right')}
          style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
        >
          <i className="fas fa-chevron-right clor"></i>
        </button>
      </div>

      {/* Carousel container */}
      <div
        ref={containerRef}
        className="carousel-container"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        {courses.map((course) => (
          <div
            key={course.id}
            className="dash-course"
            style={{
              minWidth: '250px',
              marginRight: '15px',
              flexShrink: 0,
            }}
          >
            <div className="dash-course-header" style={{background: `${course.color}`}}>{course.title}</div>
            <span className="content">{course.description}</span>
            <div className="teacher-date">
              <h2>{course.instructor}</h2>
              <ProgressBar progress={course.progress} color={course.color} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseTaken;
