import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../assets/styles/dashboard/UserDashboard.css';
// import UpNav from "../components/userDashCom/upNav";
import HeroSection from "../components/userDashCom/hero";
import CourseTaken from "../components/userDashCom/courseTaken";
import FullscreenIcon from "../components/userDashCom/fullscreenIcon";
import ActiveActivity from "../components/userDashCom/activeActivity";



function UserDashboard() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Initialize theme based on localStorage, defaulting to 'dark'
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isLightMode = theme === 'light';

  return (
    <div className={`dashboard-container ${theme}`}>
      {/* Apply theme-specific CSS variables for seamless styling */}
      <ThemeStyles theme={theme} />
      

      {/* <UpNav /> */}

      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '8px 12px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: isLightMode ? '#333' : '#f0f0f0',
          color: isLightMode ? '#fff' : '#000',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <i
          className={`fas fa-${isLightMode ? 'moon' : 'sun'}`}
          style={{ marginRight: '8px', fontSize: '16px' }}
        ></i>
        {isLightMode ? 'Dark Mode' : 'Light Mode'}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isExpanded ? '' : 'collapsed'}`}>
        {/* Toggle Button */}
        <button onClick={toggleSidebar} className="toggle-button">
          {/* {isExpanded ? 'Collapse' : 'Expand'} */}
          <i className={`fas ${isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
        </button>

        {/* Navigation Items */}
        <nav className="nav">
          <FullscreenIcon />
          <NavItem icon="home" label="Home" isExpanded={isExpanded} />
          <NavItem icon="chart-bar" label="Dashboard" isExpanded={isExpanded} />
          <NavItem icon="chalkboard-teacher" label="Online Class" isExpanded={isExpanded} />
          <NavItem icon="cog" label="Settings" isExpanded={isExpanded} />
          <NavItem icon="question-circle" label="Help" isExpanded={isExpanded} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
      <HeroSection />

      <CourseTaken />

      <ActiveActivity />
      </div>

    </div>
  );
}

// Helper component for navigation items
function NavItem({ icon, label, isExpanded }) {
  return (
    <div className="nav-item">
      <i
        className={`fas fa-${icon}`}
        style={{
          fontSize: '22px',
          marginRight: isExpanded ? '12px' : '0',
        }}
      ></i>
      {isExpanded && <span style={{ fontSize: '16px' }}>{label}</span>}
    </div>
  );
}

// React component to inject theme-specific CSS variables
function ThemeStyles({ theme }) {
  useEffect(() => {
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

  return null; // This component only sets CSS variables
}

export default UserDashboard;