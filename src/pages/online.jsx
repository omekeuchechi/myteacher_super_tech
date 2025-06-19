import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/Authcontext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../assets/styles/dashboard/onlineClass.css';
import FullscreenIcon from '../components/userDashCom/fullscreenIcon';
import ClassScheduleCalendar from '../components/userDashCom/ClassScheduleCalendar';
import DashMobileNav from '../components/userDashCom/dashMobileNav';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/userDashCom/header';


// zoom image 
import zoomImage from '../assets/illustrations/myteacher-intitute-zoom.jpg';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const OnlineClass = () => {
  const { user, logout } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [timeOffset, setTimeOffset] = useState(0); // To store the difference between server time and client time

  // Fetch user-specific lectures from backend
  useEffect(() => {
    const fetchLectures = async () => {
      setFetching(true);
      try {
        const res = await fetch(`${API_BASE}/lecture/userSpecificLecture`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.lectures)) {
          // Only show lectures that are not expired
          const nowDate = new Date();
          setClasses(
            data.lectures
              .filter(l => !l.expiringDate || new Date(l.expiringDate) > nowDate)
              .map(l => ({
                id: l._id,
                title: l.title,
                startTime: new Date(l.startTime),
                platform: l.platform,
                topics: Array.isArray(l.topics) ? l.topics : (l.topics ? [l.topics] : []),
                zoomLink: l.zoomLink,
              }))
          );
        } else {
          setClasses([]);
        }
      } catch (err) {
        setClasses([]);
      }
      setFetching(false);
    };
    fetchLectures();
  }, []);

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

  useEffect(() => {
    const timer = setInterval(() => {
      const correctedTime = new Date(new Date().getTime() + timeOffset);
      setNow(correctedTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeOffset]);

  const toggleSidebar = () => setIsExpanded(prev => !prev);
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const handleJoinClick = (cls) => {
    setSelectedClass(cls);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  // Join class: open the meeting link in a new tab if available, else show topics
  const confirmJoin = () => {
    setLoading(true);
    setTimeout(() => {
      if (selectedClass) {
        if (selectedClass.zoomLink) {
          window.open(selectedClass.zoomLink, '_blank');
        } else {
          // fallback: show topics in new window
          const topicsHtml = `
            <html>
            <head>
              <title>${selectedClass.title} - Today's Topics</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  background-color: ${theme === 'light' ? '#fff' : '#1c1c1c'};
                  color: ${theme === 'light' ? '#000' : '#fff'};
                }
                h1 {
                  font-size: 24px;
                  margin-bottom: 10px;
                }
                ul {
                  padding-left: 20px;
                }
                li {
                  margin-bottom: 6px;
                }
              </style>
            </head>
            <body>
              <h1>${selectedClass.title} - Topics</h1>
              <p>Platform: <strong>${selectedClass.platform}</strong></p>
              <ul>
                ${selectedClass.topics.map(topic => `<li>${topic}</li>`).join('')}
              </ul>
              <p>Class starts at: <strong>${selectedClass.startTime.toLocaleTimeString()}</strong></p>
            </body>
            </html>
          `;
          const newWindow = window.open('', '_blank', 'width=600,height=500');
          newWindow.document.write(topicsHtml);
          newWindow.document.close();
        }
      }
      setLoading(false);
      closeModal();
    }, 1000);
  };

  const setTimeFromServer = (serverTime) => {
    const clientTime = new Date().getTime();
    const offset = serverTime - clientTime;
    setTimeOffset(offset);
    toast.success(`Time synced! Your clock is offset by ${Math.round(offset / 1000)}s.`);
  };

  const handleCurrectTime = async () => {
    const isConfirmed = window.confirm(
      'This will attempt to sync your clock with a world time server. This is recommended if your device time is incorrect. Proceed?'
    );

    if (isConfirmed) {
      toast.info('Syncing time...');
      try {
        // First attempt: World Time API
        const response = await fetch('https://worldtimeapi.org/api/ip');
        if (!response.ok) throw new Error('World Time API failed');
        const data = await response.json();
        const serverTime = new Date(data.utc_datetime).getTime();
        setTimeFromServer(serverTime);
      } catch (error1) {
        console.warn("World Time API failed, trying fallback:", error1);
        try {
          // Fallback: timeapi.io
          const response = await fetch('https://www.timeapi.io/api/Time/current/zone?timeZone=Etc/UTC');
          if (!response.ok) throw new Error('Time API failed');
          const data = await response.json();
          const serverTime = new Date(data.dateTime).getTime();
          setTimeFromServer(serverTime);
        } catch (error2) {
          console.error("All time sync attempts failed:", error2);
          toast.error('Could not sync. This may be due to a network issue, firewall, or ad-blocker. Please check your connection and try again.');
        }
      }
    }
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
      <DashMobileNav theme={theme} />
      <Header theme={theme} />
      <button className="mobile-sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
        <i className="fas fa-bars"></i>
      </button>

      <div>
        <button
          onClick={handleCurrectTime}
          style={{
            position: 'fixed',
            bottom: '80px', 
            right: '20px',
            zIndex: 1000,
            padding: '10px 15px',
            borderRadius: '20px',
            border: '1px solid #ccc',
            cursor: 'pointer',
            background: theme === 'light' ? '#fff' : '#333',
            color: 'var(--text-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          aria-label="Sync time"
        >
          <i className="fas fa-sync-alt"></i> Sync Time
        </button>
        <button
          onClick={toggleTheme}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            padding: '10px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            background: theme === 'light' ? '#222' : '#fff',
            color: theme === 'light' ? '#fff' : '#222',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
        </button>
      </div>

      <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <button onClick={toggleSidebar} className="toggle-button" aria-label="Toggle sidebar">
          <i className={`fas ${isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
        </button>

        <nav className="nav">
          <FullscreenIcon />
          <NavItem icon="home" label="Home" move="/" isExpanded={isExpanded} />
          <NavItem icon="chart-bar" label="Dashboard" move="/dashboard" isExpanded={isExpanded} />
          <NavItem icon="user" label="Profile" move="/profile" isExpanded={isExpanded} />
          <NavItem icon="chalkboard-teacher" label="Classroom" isExpanded={isExpanded} />
          <NavItem icon="briefcase" label="Assets" isExpanded={isExpanded} move="/assets" />
          <NavItem icon="cog" label="Settings" move="/settings" isExpanded={isExpanded} />
          <NavItem icon="question-circle" label="Help" isExpanded={isExpanded} />
          <NavItem icon="right-from-bracket" label="Log Out" isExpanded={isExpanded} onClick={logout} />
        </nav>
      </div>

      <div className="main-content">
        <h2 style={{ fontSize: '26px', marginBottom: '20px' }}>📚 Online Classes</h2>

        <div className="online-class-list">
          {fetching ? (
            <div>Loading classes...</div>
          ) : classes.length === 0 ? (
            <div>No upcoming classes found.</div>
          ) : (
            classes.map((cls) => {
              const timeLeft = Math.max(0, Math.floor((new Date(cls.startTime) - now) / 1000));
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
                    padding: '16px',
                    marginBottom: '20px',
                  }}
                >
                  <h3>{cls.title}</h3>
                  <p>Platform: <strong>{cls.platform}</strong></p>
                  <p>Starts in: {cls.startTime.toLocaleTimeString()}</p>
                  {(() => {
                    const timeDifference = cls.startTime.getTime() - now.getTime();

                    const isTimeReached = timeDifference <= 0;

                    const buttonText = 'Join Class';
                    const twoHoursInMs = 2 * 60 * 60 * 1000;
                    const isWithinTwoHours = timeDifference <= twoHoursInMs;
                    const isButtonDisabled = !isTimeReached || (loading && selectedClass?.id === cls.id);

                    return (
                      <>
                        {isWithinTwoHours && (
                          <button
                            className="join-class-btn"
                            onClick={() => handleJoinClick(cls)}
                            disabled={isButtonDisabled}
                            style={{ position: 'relative' }}
                          >
                            {loading && selectedClass?.id === cls.id ? (
                              <div className="spinner" style={{
                                position: 'absolute',
                                left: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '16px',
                                height: '16px',
                                border: '2px solid #ccc',
                                borderTop: '2px solid #333',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                              }}></div>
                            ) : null}
                            <i className="fas fa-sign-in-alt"></i> {buttonText}
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
              );
            })
          )}
        </div>

        <ClassScheduleCalendar theme={theme} classes={classes} />

        <div
          className="zoom-info"
          style={{
            background: theme === 'light' ? '#f5faff' : '#232b3b',
            border: '1.5px solid #2d8cff',
            borderRadius: '14px',
            padding: '28px 18px 18px 18px',
            margin: '40px 0 0 0',
            boxShadow: theme === 'light'
              ? '0 2px 12px rgba(45,140,255,0.08)'
              : '0 2px 12px rgba(45,140,255,0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 480,
            marginTop: 15,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <img
            src={zoomImage}
            alt="myteacher zoom image"
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: 18,
              border: '3px solid #2d8cff',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(45,140,255,0.10)'
            }}
          />
          <h3 style={{
            color: '#2d8cff',
            fontWeight: 700,
            fontSize: 22,
            marginBottom: 10,
            letterSpacing: 0.5,
            textAlign: 'center'
          }}>
            <i className="fab fa-zoom" style={{ marginRight: 8 }} />Join Classes via Zoom
          </h3>
          <p style={{
            fontSize: 15,
            color: theme === 'light' ? '#222' : '#e0e6f0',
            marginBottom: 8,
            textAlign: 'center'
          }}>
            All online classes are conducted via <a href="https://zoom.us/download" target="_blank"><b>Zoom</b></a>. Make sure you have the Zoom app installed on your device.
          </p>
          <p style={{
            fontSize: 15,
            color: theme === 'light' ? '#222' : '#e0e6f0',
            marginBottom: 8,
            textAlign: 'center'
          }}>
            Click the <b>"Join Class"</b> button to enter the class at the scheduled time.
          </p>
          <p style={{
            fontSize: 15,
            color: theme === 'light' ? '#222' : '#e0e6f0',
            marginBottom: 0,
            textAlign: 'center'
          }}>
            If you have any issues joining, please contact our technical{' '}
            <a
              href="https://wa.me/2349031592480"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#2d8cff',
                textDecoration: 'underline',
                fontWeight: 600
              }}
            >
              Team
            </a>.
          </p>
        </div>
      </div>

      {showModal && selectedClass && (
        <div className="modal-overlay">
          <div className="modal-content" style={{
            background: theme === 'light' ? '#fff' : '#333',
            color: 'var(--text-color)'
          }}>
            <button className="modal-close" onClick={closeModal}><i className="fas fa-times"></i></button>
            <h3>Join Class: {selectedClass.title}</h3>
            <p>Platform: {selectedClass.platform}</p>
            <p>Are you sure you want to join this class?</p>
            <button className="modal-join-btn" onClick={confirmJoin} disabled={loading}>
              {loading ? (
                <div className="spinner" style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ccc',
                  borderTop: '2px solid #333',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px',
                }}></div>
              ) : (
                <i className="fas fa-video"></i>
              )}
              {loading ? 'Joining...' : 'Join Now'}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #333;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        .modal-content > h3{
          font-size: 25px;
        }
        .modal-content > p {
          font-size: 15px;
        }
      `}</style>
    </div>
  );
};

function NavItem({ icon, label, isExpanded, move, onClick }) {
  return (
    <Link className="nav-item" to={move || '#'} onClick={onClick}>
      <i className={`fas fa-${icon}`} style={{ fontSize: '20px', marginRight: isExpanded ? '10px' : '0' }}></i>
      {isExpanded && <span>{label}</span>}
    </Link>
  );
}

export default OnlineClass;