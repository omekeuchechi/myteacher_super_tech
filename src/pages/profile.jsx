import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/Authcontext';
import { UserInfoContext } from '../../context/UserInfoContext';
import DashMobileNav from '../components/userDashCom/dashMobileNav';
import FullscreenIcon from '../components/userDashCom/fullscreenIcon';
import '../assets/styles/dashboard/profile.css';
import '../assets/styles/dashboard/UserDashboard.css';
import Header from '../components/userDashCom/header';


const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const { userInfo, loading: userInfoLoading, error: userInfoError } = useContext(UserInfoContext);
  const [isExpanded, setIsExpanded] = useState(true);

  // Initialize theme based on localStorage, defaulting to 'dark'
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleSidebar = () => setIsExpanded(prev => !prev);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isLightMode = theme === 'light';

  // Loading and error states
  if (userInfoLoading) {
    return <div>Loading profile details...</div>;
  }
  if (userInfoError) {
    return <div>Error: {userInfoError}</div>;
  }
  if (!user || !userInfo) {
    return <div>Loading profile...</div>;
  }

  // Combine data from both contexts
  const coverPhotoUrl = userInfo.storyImage || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop';

  return (
    <div className={`dashboard-container ${theme}`}>
      <Header theme={theme} />
      <DashMobileNav theme={theme} />
      <ThemeStyles theme={theme} />

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
        {/* {isLightMode ? 'Dark Mode' : 'Light Mode'} */}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isExpanded ? '' : 'collapsed'}`}>
        {/* Toggle Button */}
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
          <NavItem icon="cog" label="Settings" move="/settings" isExpanded={isExpanded} />
          <NavItem icon="question-circle" label="Help" isExpanded={isExpanded} />
          <NavItem icon="right-from-bracket" label="Log Out" isExpanded={isExpanded} onClick={logout} />
        </nav>
      </div>
      
      <main className={`main-content ${isExpanded ? '' : 'collapsed'}`}>
        <div 
          className="profile-header" 
          style={{'--cover-photo-url': `url(${coverPhotoUrl})`}}
        >
          <div className="profile-avatar-section">
            <img 
              src={user.avatar || 'https://via.placeholder.com/168'}
              alt={`${user.name}'s avatar`} 
              className="profile-avatar" 
            />
            <div className="profile-name">
              <h1 style={{color: `${isLightMode ? '#f1f1f1' : '#0f0f0'}`}}>{user.name}</h1>
              <p style={{color: `${isLightMode ? '#000' : '#fff'}`}}>{user.role || 'Student'}</p>
            </div>
          </div>
        </div>

        <div className="profile-body">
          <div className="profile-left-column">
            <div className="profile-card" style={{ backgroundColor: isLightMode ? '#fff' : '#333' }}>
              <h3>Intro</h3>
              <ul>
                {user.email && <li><i className="fas fa-envelope"></i> {user.email}</li>}
                {userInfo.marritaStatus && <li><i className="fas fa-heart"></i> {userInfo.marritaStatus}</li>}
                {userInfo.address && <li><i className="fas fa-map-marker-alt"></i> From {userInfo.address}</li>}
                {userInfo.hobbies && <li><i className="fas fa-paint-brush"></i> Hobbies: {userInfo.hobbies}</li>}
                {user.createdAt && <li><i className="fas fa-user-clock"></i> Joined on {new Date(user.createdAt).toLocaleDateString()}</li>}
              </ul>
            </div>
          </div>
          <div className="profile-right-column">
            <div className="profile-card" style={{ backgroundColor: isLightMode ? '#fff' : '#333' }}>
              <h3>About Me</h3>
              <p>{userInfo.aboutYourSelf || 'No biography available. You can add one by editing your profile.'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper component for navigation items
function NavItem({ icon, label, isExpanded, move, onClick }) {
  return (
    <Link className="nav-item" to={move} onClick={onClick}>
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

export default Profile;