import { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../../context/Authcontext';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/styles/dashboard/certificates.css';

// Import layout components
import Header from '../components/userDashCom/header';
import DashMobileNav from '../components/userDashCom/dashMobileNav';

const API_BASE = import.meta.env.VITE_BASEURL;

// Fullscreen icon component
const FullscreenIcon = () => (
    <i className="fas fa-expand" style={{ fontSize: '22px', marginRight: '12px' }}></i>
);

// Helper component for navigation items
const NavItem = ({ icon, label, isExpanded, move, onClick }) => (
    <Link 
        to={move || '#'} 
        className="nav-item" 
        onClick={onClick}
    >
        <i className={`fas fa-${icon}`}></i>
        {isExpanded && <span>{label}</span>}
    </Link>
);


const Certificates = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    
    // State for certificates
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [hasLectureExpired, setHasLectureExpired] = useState(false);
    const [lectureExpiryDate, setLectureExpiryDate] = useState(null);
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
    });

    // Set initial theme class on mount
    useEffect(() => {
        document.documentElement.classList.add(`theme-${theme}`);
    }, []);

    // Save theme to localStorage and update HTML class
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.remove('theme-light', 'theme-dark');
        document.documentElement.classList.add(`theme-${theme}`);
    }, [theme]);

    const toggleSidebar = () => {
        setIsExpanded(prev => !prev);
    };

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const isLightMode = theme === 'light';

    // Function to download a specific certificate
    const downloadCertificate = async (lectureId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please log in to download certificate');
                return;
            }
    
            // Show loading state
            toast.info('Preparing your certificate...', { autoClose: 2000 });
    
            // Make the request to the backend endpoint
            const response = await fetch(`${API_BASE}/transaction/certificate/${lectureId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-auth-token': token,
                    'Accept': 'application/pdf'
                },
                credentials: 'include'
            });
    
            // Handle non-PDF responses (like JSON error messages)
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/pdf')) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error response from server:', errorData);
                
                if (response.status === 401) {
                    toast.error('Session expired. Please log in again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    return;
                }
                
                throw new Error(
                    errorData.message || 
                    `Failed to download certificate (${response.status} ${response.statusText})`
                );
            }
    
            // Get filename from content-disposition header or use a default name
            const contentDisposition = response.headers.get('content-disposition') || '';
            let filename = `certificate-${lectureId}.pdf`;
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '');
            }
    
            // Create and trigger download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 100);
    
            // Update the certificate as downloaded
            setCertificates(prevCerts => 
                prevCerts.map(cert => 
                    cert.lecture._id === lectureId 
                        ? { ...cert, downloaded: true } 
                        : cert
                )
            );
    
            toast.success('Certificate downloaded successfully!');
    
        } catch (error) {
            console.error('Error downloading certificate:', error);
            toast.error(error.message || 'Failed to download certificate. Please try again later.');
        }
    };

    // Helper function to handle fetch errors
    const handleFetchError = (error) => {
        console.error('Fetch error:', error);
        throw new Error('Network error. Please check your connection.');
    };

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Please log in to view certificates');
                setLoading(false);
                return;
            }

            console.log('Fetching certificates...');
            
            // Updated endpoint to match the new backend API
            const response = await fetch(`${API_BASE}/transaction/certificates`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'x-auth-token': token
                },
                credentials: 'include',
                signal: AbortSignal.timeout(15000)
            }).catch(handleFetchError);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch certificates');
            }

            const responseData = await response.json();
            console.log('Certificates API Response:', responseData);

            if (!responseData.success || !Array.isArray(responseData.certificates)) {
                throw new Error('Invalid response format from server');
            }

            // Transform the response data to match the frontend's expected format
            const formattedCertificates = responseData.certificates.map((cert) => ({
                ...cert,
                lecture: {
                    name: cert.lectureId?.title || 'Course Completion Certificate',
                    description: cert.lectureId?.description || 'Successfully completed the course requirements',
                    _id: cert.lectureId?._id || cert._id
                },
                score: 100, // Assuming successful completion since certificate exists
                grade: 'Pass',
                issuedAt: cert.createdAt || new Date().toISOString(),
                certificateIssued: true,
                uniqueId: cert._id,
                downloadUrl: `${API_BASE}/transaction/certificate/${cert.lectureId?._id || cert._id}`,
                feedback: ''
            }));

            setCertificates(formattedCertificates);
            setError(null);
        } catch (error) {
            console.error('Error fetching certificates:', error);
            setError(error.message || 'Failed to load certificates. Please try again later.');
            
            // If unauthorized, redirect to login
            if (error.message.includes('401') || error.message.includes('unauthorized')) {
                toast.error('Your session has expired. Please log in again.');
                // Uncomment to enable auto-redirect
                // navigate('/login');
            }
            
            if (error.name === 'AbortError') {
                toast.error('Request timed out. Please check your connection and try again.');
            } else if (error.message) {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to check if lecture has expired
    const checkLectureExpiry = (lectures) => {
        console.log(lectures);
        if (!lectures || !Array.isArray(lectures)) return false;
        
        const now = new Date();
        let hasAnyExpired = false;
        let earliestExpiryDate = null;
        
        lectures.forEach(lecture => {
            if (lecture.expiringDate) {
                const expiryDate = new Date(lecture.expiringDate);
                if (!earliestExpiryDate || expiryDate < earliestExpiryDate) {
                    earliestExpiryDate = expiryDate;
                }
                if (expiryDate <= now) {
                    hasAnyExpired = true;
                }
            }
        });
        
        setLectureExpiryDate(earliestExpiryDate);
        return hasAnyExpired;
    };

    useEffect(() => {
        let isMounted = true;
        
        const loadData = async () => {
            if (user?._id) {
                try {
                    await fetchCertificates();
                    
                    // Fetch user's lectures to check expiration
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${API_BASE}/lectures/user/${user._id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.lectures) {
                            const expired = checkLectureExpiry(data.lectures);
                            setHasLectureExpired(expired);
                        }
                    }
                } catch (error) {
                    if (isMounted) {
                        setError('Failed to load certificates. Please try again.');
                        console.error('Error in fetchCertificates:', error);
                    }
                } finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            } else {
                setError('Please log in to view certificates');
                setLoading(false);
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [user]);

    // Filter certificates based on active tab
    const filteredCertificates = certificates;

    if (loading) {
        return (
            <div className={`dashboard-container ${isLightMode ? 'light-theme' : 'dark-theme'}`}>
                <Header theme={theme} />
                <DashMobileNav theme={theme} />
                <div className={`dashboard-content ${!isExpanded ? 'expanded' : ''}`}>
                    <div className="certificates-loading">
                        <div className="spinner"></div>
                        <p>Loading your certificates...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`dashboard-container ${isLightMode ? 'light-theme' : 'dark-theme'}`}>
                <Header theme={theme} />
                <DashMobileNav theme={theme} />
                <div className={`dashboard-content ${!isExpanded ? 'expanded' : ''}`}>
                    <div className="certificates-error">
                        <p>{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="retry-btn"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="certificates-page">
            <div className={`dashboard-container ${isLightMode ? 'light-theme' : 'dark-theme'}`} style={{ backgroundColor: theme === 'dark' ? '#000' : '#fff' }}>
                <Header theme={theme} />
                <DashMobileNav theme={theme} />
                <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${theme}`}>
                    <button onClick={toggleSidebar} className="toggle-button">
                        <i className={`fas ${isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
                    </button>
                    <nav className="nav">
                        <div className="nav-item" onClick={toggleSidebar}>
                            <FullscreenIcon />
                            {isExpanded && <span style={{ fontSize: '16px' }}>Collapse</span>}
                        </div>
                        <NavItem icon="home" label="Home" move="/" isExpanded={isExpanded} />
                        <NavItem icon="chart-bar" label="Dashboard" move="/dashboard" isExpanded={isExpanded} />
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
                <div className="dashboard-content" style={{ backgroundColor: theme === 'dark' ? '#000' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}>
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
                        <i className={`fas fa-${isLightMode ? 'moon' : 'sun'}`} style={{ marginRight: '8px', fontSize: '16px' }}></i>
                    </button>
                    <div className="certificates-container">
                        <div className="certificates-header">
                            <h1><i className="fas fa-certificate"></i> My Certificates</h1>
                            <p>View and manage your earned certificates</p>
                            
                            <div className="certificate-tabs">
                                <button 
                                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('all')}
                                >
                                    All Certificates
                                </button>
                                <button 
                                    className={`tab-btn ${activeTab === 'downloaded' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('downloaded')}
                                >
                                    <i className="fas fa-check-circle"></i> Downloaded
                                </button>
                            </div>
                            {hasLectureExpired ? (
                                <div className="certificates-actions">
                                    <button 
                                        className="btn btn-primary"
                                        onClick={downloadTotalCertificate}
                                        style={{padding: '20px 20px', fontSize: '16px', width: '50%'}}
                                    >
                                        <i className="fas fa-download"></i> Download Total Certificate
                                    </button>
                                </div>
                            ) : (
                                <div className="certificate-expiry-notice" style={{
                                    backgroundColor: '#fff3cd',
                                    color: '#856404',
                                    padding: '15px',
                                    borderRadius: '4px',
                                    margin: '15px 0',
                                    borderLeft: '4px solid #ffeeba',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <i className="fas fa-info-circle" style={{fontSize: '20px'}}></i>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', width: '100%'}}>
                                        <strong>Notice:</strong> The total certificate will be available for download after your lecture period ends.
                                        {lectureExpiryDate && (
                                            <div>Your lecture ends on: {new Date(lectureExpiryDate).toLocaleDateString()}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {filteredCertificates.length === 0 ? (
                            <div className="no-certificates">
                                <i className="fas fa-certificate"></i>
                                <h3>No Certificates Found</h3>
                                <p>You don't have any certificates yet.</p>
                            </div>
                        ) : (
                            <div className="certificates-grid">
                                {filteredCertificates.map((cert) => (
                                    <div key={cert.uniqueId} className={`certificate-card ${cert.downloaded ? 'downloaded' : ''}`}>
                                        <div className="certificate-header">
                                            <div className="certificate-icon">
                                                <i className="fas fa-certificate"></i>
                                                {cert.downloaded && (
                                                    <span className="downloaded-badge">
                                                        <i className="fas fa-check"></i>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="certificate-meta">
                                                <h3 className="certificate-title">
                                                    {cert.lecture.name || 'Course Completion Certificate'}
                                                </h3>
                                                <div className="certificate-details">
                                                    {cert.lecture?.courseId?.name && (
                                                        <p className="course-name">
                                                            <i className="fas fa-book"></i>
                                                            {cert.lecture.courseId.name}
                                                        </p>
                                                    )}
                                                    {cert.lecture?.startTime && (
                                                        <p className="lecture-date">
                                                            <i className="far fa-calendar-alt"></i>
                                                            {new Date(cert.lecture.startTime).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    )}
                                                    {cert.lecture?.platform && (
                                                        <p className="lecture-platform">
                                                            <i className="fas fa-laptop"></i>
                                                            {cert.lecture.platform}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="certificate-description">
                                                    <p>Successfully completed the course requirements.</p>
                                                    <p>You can View the Certificate by clicking View</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="certificate-actions">
                                            <a 
                                                href={cert.downloadurl}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="download-btn"
                                                onClick={() => {
                                                    if (!cert.downloaded) {
                                                        setCertificates(prevCerts => 
                                                            prevCerts.map(c => 
                                                                c.uniqueId === cert.uniqueId 
                                                                    ? { ...c, downloaded: true } 
                                                                    : c
                                                            )
                                                        );
                                                    }
                                                }}
                                            >
                                                <i className={`fas ${cert.downloaded ? 'fa-check' : 'fa-download'}`}></i>
                                                {cert.downloaded ? 'Downloaded' : 'Download'}
                                            </a>
                                            <button 
                                                onClick={() => {
                                                    if (cert.downloadurl && cert.downloadurl.startsWith('data:application/pdf;base64,')) {
                                                        const win = window.open('', '_blank');
                                                        win.document.write(`
                                                            <html>
                                                                <head><title>Certificate</title></head>
                                                                <body style="margin: 0; height: 100vh;">
                                                                    <embed 
                                                                        src="${cert.downloadurl}" 
                                                                        type="application/pdf" 
                                                                        style="width: 100%; height: 100%;"
                                                                    />
                                                                </body>
                                                            </html>
                                                        `);
                                                    } else {
                                                        window.open(cert.downloadurl, '_blank');
                                                    }
                                                }}
                                                className="view-btn"
                                            >
                                                <i className="fas fa-eye"></i> View
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Certificates;