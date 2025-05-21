import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import '../assets/styles/dashboard/UserDashboard.css';
import '../assets/styles/dashboard/onlineClass.css';
import FullscreenIcon from '../components/userDashCom/fullscreenIcon';
import { Link } from 'react-router-dom';

const OnlineClass = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--bg-color', '#fff');
      root.style.setProperty('--text-color', '#000');
      root.style.setProperty('--sidebar-bg', '#f5f5f5');
      root.style.setProperty('--sidebar-text', '#000');
    } else {
      root.style.setProperty('--bg-color', '#222');
      root.style.setProperty('--text-color', '#fff');
      root.style.setProperty('--sidebar-bg', '#333');
      root.style.setProperty('--sidebar-text', '#fff');
    }
  }, [theme]);

  const toggleSidebar = () => setIsExpanded(prev => !prev);
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const sampleClasses = [
    {
      id: 1,
      title: 'React Basics',
      startTime: new Date(Date.now() + 1000 * 60 * 60),
      platform: 'Zoom',
    },
    {
      id: 2,
      title: 'Data Structures',
      startTime: new Date(Date.now() + 1000 * 60 * 90),
      platform: 'Google Meet',
    },
  ];

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinClick = (cls) => {
    setSelectedClass(cls);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  const confirmJoin = () => {
    alert(`Joining ${selectedClass.title} on ${selectedClass.platform}`);
    closeModal();
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      {/* Mobile sidebar toggle */}
      <button className="mobile-sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
        <i className="fas fa-bars"></i>
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '8px 12px',
          borderRadius: '4px',
          backgroundColor: theme === 'light' ? '#333' : '#eee',
          color: theme === 'light' ? '#fff' : '#000',
        }}
      >
        <i className={`fas fa-${theme === 'light' ? 'moon' : 'sun'}`} style={{ marginRight: '6px' }} />
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <button onClick={toggleSidebar} className="toggle-button" aria-label="Toggle sidebar">
          <i className={`fas ${isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
        </button>

        <nav className="nav">
          <FullscreenIcon />
          <NavItem icon="home" label="Home" move="/" isExpanded={isExpanded} />
          <NavItem icon="chart-bar" label="Dashboard" move="/dashboard" isExpanded={isExpanded} />
          <NavItem icon="chalkboard-teacher" label="Online Class" isExpanded={isExpanded} />
          <NavItem icon="briefcase" label="Assets" isExpanded={isExpanded} />
          <NavItem icon="cog" label="Settings" isExpanded={isExpanded} />
          <NavItem icon="question-circle" label="Help" isExpanded={isExpanded} />
          <NavItem icon="right-from-bracket" label="Log Out" isExpanded={isExpanded} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2 style={{ fontSize: '26px', marginBottom: '20px' }}>📚 Online Classes</h2>

        <div className="online-class-list">
          {sampleClasses.map((cls) => {
            const timeLeft = Math.max(0, Math.floor((cls.startTime - now) / 1000));
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;

            return (
              <div
                className="online-class-card"
                key={cls.id}
                style={{
                  background: theme === 'light' ? '#f8f8f8' : '#2e2e2e',
                  color: 'var(--text-color)',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '20px',
                }}
              >
                <h3>{cls.title}</h3>
                <p>Platform: <strong>{cls.platform}</strong></p>
                <p>Starts in: {hours}h {minutes}m {seconds}s</p>
                <button className="join-class-btn" onClick={() => handleJoinClick(cls)}>
                  <i className="fas fa-sign-in-alt"></i> Join Class
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedClass && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{
              background: theme === 'light' ? '#fff' : '#333',
              color: 'var(--text-color)',
            }}
          >
            <button className="modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            <h3>Join Class: {selectedClass.title}</h3>
            <p>Platform: {selectedClass.platform}</p>
            <p>Are you sure you want to join this class?</p>
            <button className="modal-join-btn" onClick={confirmJoin}>
              <i className="fas fa-video"></i> Join Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Sidebar Nav Item
function NavItem({ icon, label, isExpanded, move }) {
  return (
    <Link className="nav-item" to={move || '#'}>
      <i className={`fas fa-${icon}`} style={{ fontSize: '20px', marginRight: isExpanded ? '10px' : '0' }}></i>
      {isExpanded && <span>{label}</span>}
    </Link>
  );
}

export default OnlineClass;
