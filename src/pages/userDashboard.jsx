import React, { useState, useEffect, useContext, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../assets/styles/dashboard/UserDashboard.css';
import HeroSection from "../components/userDashCom/hero";
import CourseTaken from "../components/userDashCom/courseTaken";
import FullscreenIcon from "../components/userDashCom/fullscreenIcon";
import ActiveActivity from "../components/userDashCom/activeActivity";
import DashMobileNav from '../components/userDashCom/dashMobileNav';
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/Authcontext';
import Header from '../components/userDashCom/header';
import QuickLinks from '../components/userDashCom/quickLinks';
import { Modal, Box, Typography, Button } from '@mui/material';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000";

// Modal style
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
  outline: 'none',
};

// Arrow component for the tour
const Arrow = ({ position = 'top' }) => (
  <div className={`arrow arrow-${position}`}>
    <i className="fas fa-arrow-down"></i>
  </div>
);

function UserDashboard() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { user, logout } = useContext(AuthContext);
  const navRef = useRef(null);

  // Initialize theme based on localStorage, defaulting to 'dark'
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
  });

  // Check if tour should be shown (once per day)
  useEffect(() => {
    const lastTourDate = localStorage.getItem('lastTourDate');
    const today = new Date().toDateString();
    
    if (!lastTourDate || new Date(lastTourDate).toDateString() !== today) {
      setShowTour(true);
      localStorage.setItem('lastTourDate', new Date().toISOString());
    }
  }, []);

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

  const handleTourClose = () => {
    setShowTour(false);
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const isLightMode = theme === 'light';

  // Tour steps
  const tourSteps = [
    {
      title: 'Welcome to Your Dashboard!',
      content: 'This is your main navigation menu. Let us guide you through the options.',
      position: 'right',
      target: '.sidebar',
    },
    {
      title: 'Navigation Menu',
      content: 'Here you can access all the main sections of your dashboard.',
      position: 'right',
      target: '.nav',
    },
    {
      title: 'Quick Actions',
      content: 'Use these buttons to quickly access important features.',
      position: 'top',
      target: '.quick-links',
    },
  ];

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className={`dashboard-container ${theme}`}>
      <DashMobileNav theme={theme} />
      <Header theme={theme} />

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
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isExpanded ? '' : 'collapsed'}`} ref={navRef}>
        <button onClick={toggleSidebar} className="toggle-button">
          <i className={`fas ${isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
        </button>

        {/* Navigation Items */}
        <nav className="nav">
          <FullscreenIcon />
          <NavItem icon="home" label="Home" move="/" isExpanded={isExpanded} />
          <NavItem icon="chart-bar" label="Dashboard" isExpanded={isExpanded} move="/dashboard" />
          <NavItem icon="user" label="Profile" move="/profile" isExpanded={isExpanded} />
          <NavItem icon="chalkboard-teacher" move="/online-class" label="Online Class" isExpanded={isExpanded} />
          <NavItem icon="briefcase" label="Assets" move="/assets" isExpanded={isExpanded} />
          <NavItem icon="school" move="/on-site" label="On Site" isExpanded={isExpanded} />
          <NavItem icon="cog" label="Settings" move="/settings" isExpanded={isExpanded} target="_blank"/>
          <NavItem icon="question-circle" label="Help" isExpanded={isExpanded} target="_blank"/>
          <NavItem icon="right-from-bracket" label="Log Out" isExpanded={isExpanded} onClick={logout} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <HeroSection />

        <CourseTaken theme={theme} />

        <div className={`quick-links ${theme}`}>
          <QuickLinks theme={theme} />
        </div>

        <div className={`apply-for-course-section ${theme}`}>
          <h2 className={`${theme}`}>Do you want an online Live class/Training. Simply Apply here to get started.</h2>
          <Link to="/apply" className='apply'><i className='fas fa-plus'></i> Apply</Link>
        </div>
      </div>

      {/* Navigation Tour Modal */}
      <Modal
        open={showTour}
        onClose={handleTourClose}
        aria-labelledby="navigation-tour-modal"
        aria-describedby="navigation-tour-description"
        style={{ backdropFilter: 'blur(2px)' }}
      >
        <Box sx={{
          ...modalStyle,
          position: 'absolute',
          top: currentTourStep?.position === 'top' ? '25%' : '50%',
          left: currentTourStep?.position === 'right' ? 'calc(200px + 10%)' : '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          zIndex: 1400,
        }}>
          <Typography id="navigation-tour-modal" variant="h6" component="h2" sx={{ mb: 2 }}>
            {currentTourStep?.title}
          </Typography>
          <Typography id="navigation-tour-description" sx={{ mb: 3 }}>
            {currentTourStep?.content}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
            <Button 
              onClick={currentStep === 0 ? handleTourClose : handlePrevStep}
              variant="outlined"
            >
              {currentStep === 0 ? 'Skip' : 'Back'}
            </Button>
            <Button 
              onClick={currentStep === tourSteps.length - 1 ? handleTourClose : handleNextStep}
              variant="contained"
              sx={{ ml: 2 }}
            >
              {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

// Helper component for navigation items
function NavItem({ icon, label, isExpanded, move, onClick, target }) {
  return (
    <Link className="nav-item" to={move} onClick={onClick} target={target}>
      <i
        className={`fas fa-${icon}`}
        style={{
          fontSize: '22px',
          marginRight: isExpanded ? '12px' : '0',
        }}
      ></i>
      {isExpanded && <span style={{ fontSize: '16px' }}>{label}</span>}
    </Link>
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
