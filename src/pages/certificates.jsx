import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/Authcontext';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/styles/dashboard/certificates.css';

// Import layout components
import Header from '../components/userDashCom/header';
import DashMobileNav from '../components/userDashCom/dashMobileNav';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

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

// Helper function to calculate grade based on score
const calculateGrade = (score) => {
    if (score >= 90) return 'A+ (Distinction)';
    if (score >= 80) return 'A (Excellent)';
    if (score >= 70) return 'B+ (Very Good)';
    if (score >= 60) return 'B (Good)';
    if (score >= 50) return 'C (Satisfactory)';
    return 'D (Pass)';
};

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

    // Function to download total certificate
    const downloadTotalCertificate = async () => {
        try {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            
            if (!token || !user) {
                toast.error('Please log in to download certificate');
                return;
            }
    
            // Show loading state
            toast.info('Preparing your certificate...', { autoClose: 2000 });
    
            // Parse the user data to get the user ID
            let userData;
            try {
                userData = JSON.parse(user);
            } catch (e) {
                console.error('Error parsing user data:', e);
                toast.error('Invalid user session. Please log in again.');
                return;
            }
    
            // Get user ID from the user object
            const userId = userData.id || userData._id;
            if (!userId) {
                toast.error('Invalid user session. Please log in again.');
                return;
            }
    
            // Make the request to the backend endpoint
            const response = await fetch(`${API_BASE}/certificates/download-total-certificate/${userId}`, {
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
                    // navigate('/login');
                    return;
                }
                
                throw new Error(
                    errorData.message || 
                    `Failed to download certificate (${response.status} ${response.statusText})`
                );
            }
    
            // Get filename from content-disposition header or use a default name
            const contentDisposition = response.headers.get('content-disposition') || '';
            let filename = `total-certificate-${new Date().toISOString().split('T')[0]}.pdf`;
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
    
            toast.success('Certificate downloaded successfully!');
    
        } catch (error) {
            console.error('Error downloading total certificate:', error);
            if (error.message === 'User not found') {
                toast.error('Your session has expired. Please log in again.');
                // Optionally clear local storage and redirect to login
                // localStorage.removeItem('token');
                // localStorage.removeItem('user');
                // navigate('/login');
            } else {
                toast.error(error.message || 'Failed to download certificate. Please try again later.');
            }
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
            const user = localStorage.getItem('user');
            
            if (!token || !user) {
                setError('Please log in to view certificates');
                setLoading(false);
                return;
            }

            let userData;
            try {
                userData = JSON.parse(user);
            } catch (e) {
                console.error('Error parsing user data:', e);
                setError('Invalid user session. Please log in again.');
                setLoading(false);
                return;
            }

            // Get user ID from the user object
            const userId = userData.id || userData._id;
            if (!userId) {
                setError('Invalid user session. Please log in again.');
                setLoading(false);
                return;
            }

            console.log('Fetching certificates for user:', userId);
            
            // Make the fetch request to the updated endpoint
            const response = await fetch(`${API_BASE}/certificates/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'x-auth-token': token
                },
                credentials: 'include',
                signal: AbortSignal.timeout(15000) // 15 second timeout
            }).catch(handleFetchError);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to fetch certificates');
            }

            const responseData = await response.json();
            console.log('Certificates API Response:', responseData);

            if (!responseData.success || !responseData.data) {
                throw new Error('Invalid response format from server');
            }

            // Transform the response data to match the frontend's expected format
            const formattedCertificates = responseData.data.map((cert, index) => ({
                ...cert,
                // Ensure we have all required fields with fallbacks
                lecture: cert.lecture || { 
                    name: 'Course Completion Certificate', 
                    description: 'Successfully completed the course requirements',
                    _id: `lecture-${index}`
                },
                score: typeof cert.score === 'number' ? cert.score : 0,
                grade: cert.grade || calculateGrade(cert.score || 0),
                issuedAt: cert.issuedAt || new Date().toISOString(),
                certificateIssued: cert.certificateIssued !== undefined ? cert.certificateIssued : true,
                _id: cert._id || `cert-${Date.now()}-${index}`,
                uniqueId: cert._id || `cert-${Date.now()}-${index}`,
                downloadUrl: `${API_BASE}/certificates/download/${cert._id || `cert-${Date.now()}-${index}`}`,
                feedback: cert.feedback || ''
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

    const handleDownload = async (certificate) => {
        if (!certificate._id) {
            toast.info('This certificate is not available for download');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            toast.info('Preparing your download...', { autoClose: 2000 });
            
            // Construct the download URL with the score ID
            const downloadUrl = `${API_BASE}/certificates/download/${certificate._id}`;
            console.log('Downloading certificate from:', downloadUrl);
            
            const response = await fetch(downloadUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-auth-token': token,
                    'Accept': 'application/pdf'
                },
                credentials: 'include',
                signal: AbortSignal.timeout(30000)
            });

            // Handle non-OK responses
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Download failed with status:', response.status, errorText);
                
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    throw new Error('Session expired. Please log in again.');
                } else if (response.status === 404) {
                    throw new Error('Certificate not found. Please complete an assignment first.');
                } else {
                    throw new Error(`Server error: ${response.status} - ${errorText || 'Unknown error'}`);
                }
            }

            // Get the blob data
            const blob = await response.blob();
            if (!blob || blob.size === 0) {
                throw new Error('Received empty file');
            }

            // Get the filename from content-disposition header or generate one
            let filename = 'certificate.pdf';
            const contentDisposition = response.headers.get('content-disposition');
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }

            // If no filename in headers, generate one
            if (filename === 'certificate.pdf' && certificate.lecture?.name) {
                const courseName = certificate.lecture.name
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
                
                const userName = (user?.name || 'user')
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
                    
                const dateStr = new Date().toISOString().split('T')[0];
                filename = `certificate-${courseName}-${userName}-${dateStr}.pdf`;
            }
            
            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            }, 100);
            
            // Update the certificate as downloaded
            setCertificates(prevCerts => 
                prevCerts.map(cert => 
                    cert._id === certificate._id 
                        ? { ...cert, downloaded: true } 
                        : cert
                )
            );
            
            toast.success('Download started!', { autoClose: 3000 });
            
        } catch (err) {
            console.error('Error downloading certificate:', err);
            let errorMessage = 'Failed to download certificate';
            
            if (err.response) {
                if (err.response.status === 401) {
                    errorMessage = 'Session expired. Please log in again.';
                    localStorage.removeItem('token');
                    setTimeout(() => window.location.href = '/login', 2000);
                } else if (err.response.status === 404) {
                    errorMessage = 'Certificate not found. Please complete an assignment first.';
                } else if (err.response.status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
            } else if (err.name === 'AbortError' || err.code === 'ECONNABORTED') {
                errorMessage = 'Request timed out. Please check your connection and try again.';
            } else if (!navigator.onLine) {
                errorMessage = 'No internet connection. Please check your network.';
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            toast.error(errorMessage, { autoClose: 5000 });
        }
    };

    // Filter certificates based on active tab
    const filteredCertificates = certificates.filter(cert => {
        if (activeTab === 'all') return true;
        if (activeTab === 'downloaded') return cert.downloaded;
        return true;
    });

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
                                    <div>
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
                                                <span className="certificate-id">
                                                    ID: {cert._id?.slice(-8).toUpperCase() || 'N/A'}
                                                </span>
                                                <h3 className="certificate-title">
                                                    {cert.lecture?.name || 'Course Completion Certificate'}
                                                </h3>
                                                <div className="certificate-grade">
                                                    <i className="fas fa-star star-icon"></i>
                                                    <span>Grade: {cert.grade || calculateGrade(cert.score || 0)}</span>
                                                    <span className="score">{cert.score || 0}%</span>
                                                </div>
                                                <div className="certificate-description">
                                                    {cert.lecture?.description || 'Successfully completed the course requirements.'}
                                                    {cert.feedback && (
                                                        <div className="feedback-section">
                                                            <h4>Feedback:</h4>
                                                            <p>{cert.feedback}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="certificate-actions">
                                            <button 
                                                onClick={() => handleDownload(cert)}
                                                className="download-btn"
                                                disabled={!cert.certificateIssued}
                                            >
                                                <i className={`fas ${cert.downloaded ? 'fa-check' : 'fa-download'}`}></i>
                                                {cert.downloaded ? 'Downloaded' : 'Download'}
                                            </button>
                                            {cert.certificateIssued && (
                                                <a 
                                                    href={`${API_BASE}/certificates/download/${cert.lecture?._id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="view-btn"
                                                    onClick={(e) => {
                                                        if (!cert.downloaded) {
                                                            e.preventDefault();
                                                            handleDownload(cert);
                                                        }
                                                    }}
                                                >
                                                    <i className="fas fa-eye"></i> View
                                                </a>
                                            )}
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