import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/Authcontext';
import { UserInfoContext } from '../../context/UserInfoContext';
import DashMobileNav from '../components/userDashCom/dashMobileNav';
import FullscreenIcon from '../components/userDashCom/fullscreenIcon';
import '../assets/styles/dashboard/profile.css';
import '../assets/styles/dashboard/UserDashboard.css';
import Header from '../components/userDashCom/header';


import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showCoverPhotoModal, setShowCoverPhotoModal] = useState(false);
  const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000";

  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);

  // Close modal when clicking outside the image
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeImageModal();
    }
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeImageModal();
      }
    };

    if (isImageModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isImageModalOpen]);
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/user_info/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to search users');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search users');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      handleSearch(query);
    }, 500);

    setDebounceTimer(timer);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // User state and context
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
          <NavItem icon="book" label="Assignment" move="/assignment" isExpanded={isExpanded} />
          <NavItem icon="certificate" label="Certificates" move="/certificates" isExpanded={isExpanded} />
          <NavItem icon="cog" label="Settings" move="/settings" isExpanded={isExpanded} />
          <NavItem icon="question-circle" label="Help" isExpanded={isExpanded} />
          <NavItem icon="right-from-bracket" label="Log Out" isExpanded={isExpanded} onClick={logout} />
        </nav>
      </div>

      <main className={`main-content ${isExpanded ? '' : 'collapsed'}`}>
        {/* {console.log(coverPhotoUrl)} */}
        <div
          className="profile-header"
          style={{
            '--cover-photo-url': coverPhotoUrl ? `url(${coverPhotoUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            height: '300px',
            borderRadius: '8px',
            marginBottom: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: coverPhotoUrl ? 'pointer' : 'default',
            transition: 'transform 0.2s ease',
          }}
          onClick={() => coverPhotoUrl && setShowCoverPhotoModal(true)}
          onMouseOver={(e) => coverPhotoUrl && (e.currentTarget.style.transform = 'scale(1.01)')}
          onMouseOut={(e) => coverPhotoUrl && (e.currentTarget.style.transform = 'scale(1)')}
        >
          {/* Add a semi-transparent overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px'
          }} />
          <div className="profile-avatar-section">
            <img
              src={user.avatar || 'https://via.placeholder.com/168'}
              alt={`${user.name}'s avatar`}
              className="profile-avatar"
              onClick={openImageModal}
              style={{ cursor: 'pointer' }}
            />

            {/* Image Modal */}
            {isImageModalOpen && (
              <div
                className="image-modal-backdrop"
                onClick={handleBackdropClick}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1000,
                  cursor: 'zoom-out'
                }}
              >
                <div className="image-modal-content" style={{ maxWidth: '90%', maxHeight: '90%' }}>
                  <button
                    onClick={closeImageModal}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 1001
                    }}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <img
                    src={user.avatar || 'https://via.placeholder.com/168'}
                    alt={`${user.name}'s avatar`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '90vh',
                      objectFit: 'contain',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            )}
            <div className="profile-name">
              <h1 style={{ color: `${isLightMode ? '#f1f1f1' : '#0f0f0'}` }}>{user.name}</h1>
              <p style={{ color: `${isLightMode ? '#000' : '#fff'}` }}>{user.role || 'Student'}</p>
            </div>
          </div>
        </div>

        <div className="social-reflection-section">

        <div className="search-user-query">
          <input
            type="text"
            placeholder="Search for Techies..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {isSearching && <div className="search-loading">Searching...</div>}
        </div>


          <div className="search-results">
            {searchResults.map((searchUser) => (
              <Link
                key={searchUser._id}
                to={{
                  pathname: `/profile-search/${searchUser._id}`,
                  state: { userData: searchUser }
                }}
                className="user-card-link"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="user-card">
                  <img
                    src={searchUser.userInfo?.storyImage || '/default-avatar.png'}
                    alt={searchUser.name}
                    className="user-avatar"
                  />
                  <div className="user-info">
                    <h3>{searchUser.name}</h3>
                    {searchUser.userInfo?.aboutYourSelf && (
                      <p className="user-bio">
                        {searchUser.userInfo.aboutYourSelf.length > 50
                          ? `${searchUser.userInfo.aboutYourSelf.substring(0, 50)}...`
                          : searchUser.userInfo.aboutYourSelf}
                      </p>
                    )}
                    <div className="user-details">
                      {searchUser.userInfo?.hobbies && (
                        <span className="user-hobby">
                          <i className="fas fa-heart"></i> {searchUser.userInfo.hobbies}
                        </span>
                      )}
                      {searchUser.userInfo?.marritaStatus && (
                        <span className="user-status">
                          <i className="fas fa-heart"></i> {searchUser.userInfo.marritaStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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

      {/* Cover Photo Modal */}
      {showCoverPhotoModal && coverPhotoUrl && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
          onClick={() => setShowCoverPhotoModal(false)}
        >
          <div
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              position: 'relative',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={coverPhotoUrl}
              alt="Cover"
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
            />
            <button
              onClick={() => setShowCoverPhotoModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 0, 0, 0.8)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'}
            >
              ×
            </button>
          </div>
        </div>
      )}
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

// Add these styles to your CSS file or use a CSS-in-JS solution
const styles = `
.user-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.search-user-query {
  padding: 10px;
  position: relative;
}

.search-user-query input {
  width: 100%;
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid #ddd;
  font-size: 14px;
  outline: none;
}

.search-loading {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 12px;
}

.search-results {
  margin-top: 15px;
  max-height: 400px;
  overflow-y: auto;
}

.user-card {
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-card:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.user-info {
  flex: 1;
}

.user-info h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
}

.user-bio {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
}

.user-details {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #888;
}

.user-hobby,
.user-status {
  display: flex;
  align-items: center;
  gap: 5px;
}

.user-hobby i,
.user-status i {
  color: #ff6b6b;
}
`;

// Add styles to the document
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);