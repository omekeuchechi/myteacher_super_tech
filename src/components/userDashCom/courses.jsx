import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/Authcontext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_BASEURL 

const CoursesApplied = ({theme}) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [isLeaving, setIsLeaving] = useState(false);

    const styles = (theme) => ({
        container: {
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#333' : 'white',
            color: theme === 'dark' ? 'white' : 'inherit'
        },
        heading: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: theme === 'dark' ? 'white' : 'inherit'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5rem',
            marginTop: '1rem'
        },
        card: {
            border: `1px solid ${theme === 'dark' ? '#2d3748' : '#e2e8f0'}`,
            borderRadius: '0.5rem',
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#2e2828e0' : 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            color: theme === 'dark' ? 'white' : 'inherit'
        },
        cardHover: {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)'
        },
        title: {
            fontSize: '1.25rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: theme === 'dark' ? 'white' : 'inherit'
        },
        description: {
            color: theme === 'dark' ? '#cbd5e0' : '#4a5568',
            marginBottom: '0.5rem'
        },
        time: {
            fontSize: '0.875rem',
            color: theme === 'dark' ? '#a0aec0' : '#718096'
        },
        instructor: {
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: theme === 'dark' ? '#a0aec0' : 'inherit'
        },
        button: {
            marginTop: '1rem',
            backgroundColor: theme === 'dark' ? '#4a90e2' : '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            '&:hover': {
                backgroundColor: theme === 'dark' ? '#3182ce' : '#2563eb'
            },
            marginRight: '0.5rem'
        },
        leaveButton: {
            backgroundColor: theme === 'dark' ? '#e53e3e' : '#dc2626',
            '&:hover': {
                backgroundColor: theme === 'dark' ? '#c53030' : '#b91c1c'
            }
        },
        buttonGroup: {
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        modalContent: {
            backgroundColor: theme === 'dark' ? '#2e2828e0' : 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        modalTitle: {
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: theme === 'dark' ? 'white' : 'inherit'
        },
        modalButtons: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginTop: '1.5rem'
        },
        cancelButton: {
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: '1px solid #e2e8f0',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            color: theme === 'dark' ? 'white' : 'inherit',
            '&:hover': {
                backgroundColor: theme === 'dark' ? '#4a5568' : '#f7fafc'
            }
        }
    });

    const themeStyles = styles(theme);

    const fetchUserLectures = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/lectures/userSpecificLecture`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (res.ok) {
                setLectures(data.lectures || []);
            } else {
                throw new Error(data.message || 'Failed to fetch lectures');
            }
        } catch (err) {
            setError(err.message || 'Error fetching lectures');
            toast.error(err.message || 'Error fetching lectures');
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveClick = (lectureId) => {
        setSelectedLecture(lectureId);
        setShowConfirmModal(true);
    };

    const handleConfirmLeave = async () => {
        if (!selectedLecture) return;
        
        setIsLeaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/lectures/logout/${selectedLecture}`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await res.json();
            
            if (res.ok) {
                toast.success('Successfully left the lecture');
                fetchUserLectures();
            } else {
                throw new Error(data.message || 'Failed to leave lecture');
            }
        } catch (err) {
            toast.error(err.message || 'Error leaving lecture');
            console.error('Error leaving lecture:', err);
        } finally {
            setIsLeaving(false);
            setShowConfirmModal(false);
            setSelectedLecture(null);
        }
    };

    const handleCancelLeave = () => {
        setShowConfirmModal(false);
        setSelectedLecture(null);
    };

    useEffect(() => {
        fetchUserLectures();
    }, []);

    if (loading) return <div style={{ color: theme === 'dark' ? 'white' : 'inherit' }}>Loading lectures...</div>;
    if (error) return <div style={{ color: '#e53e3e' }}>Error: {error}</div>;
    
    return (
        <>
            <div style={themeStyles.container}>
                <h2 style={themeStyles.heading}>My Lectures</h2>
                <div style={themeStyles.grid}>
                    {lectures.length === 0 ? (
                        <p style={{ color: theme === 'dark' ? '#a0aec0' : 'inherit' }}>No lectures found.</p>
                    ) : (
                        lectures.map((lecture) => {
                            const startTime = new Date(lecture.startTime).toLocaleString();
                            const endTime = new Date(lecture.expiringDate).toLocaleString();
                            
                            return (
                                <div 
                                    key={lecture._id} 
                                    style={themeStyles.card}
                                    onMouseOver={e => {
                                        e.currentTarget.style.boxShadow = themeStyles.cardHover.boxShadow;
                                        e.currentTarget.style.transform = themeStyles.cardHover.transform;
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.boxShadow = themeStyles.card.boxShadow;
                                        e.currentTarget.style.transform = 'none';
                                    }}
                                >
                                    <h3 style={themeStyles.title}>{lecture.title}</h3>
                                    <p style={themeStyles.description}>{lecture.description}</p>
                                    <div style={themeStyles.time}>
                                        <p>Starts: {startTime}</p>
                                        <p>Ends: {endTime}</p>
                                    </div>
                                    {lecture.lecturesListed?.[0]?.name && (
                                        <p style={themeStyles.instructor}>
                                            Instructor: {lecture.lecturesListed[0].name}
                                        </p>
                                    )}
                                    <div style={themeStyles.buttonGroup}>
                                        <button 
                                            onClick={() => navigate(`/per-lecture/${lecture._id}`, {state: {lecture}})}
                                            style={themeStyles.button}
                                        >
                                            View Lecture
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLeaveClick(lecture._id);
                                            }}
                                            style={{...themeStyles.button, ...themeStyles.leaveButton}}
                                            disabled={isLeaving}
                                        >
                                            {isLeaving ? 'Leaving...' : 'Leave Lecture'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div style={themeStyles.modalOverlay}>
                    <div style={themeStyles.modalContent}>
                        <h3 style={themeStyles.modalTitle}>Leave Lecture</h3>
                        <p style={{ color: theme === 'dark' ? '#cbd5e0' : '#4a5568' }}>
                            Are you sure you want to leave this lecture? This action cannot be undone.
                        </p>
                        <div style={themeStyles.modalButtons}>
                            <button 
                                onClick={handleCancelLeave}
                                style={themeStyles.cancelButton}
                                disabled={isLeaving}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmLeave}
                                style={{
                                    ...themeStyles.button,
                                    ...themeStyles.leaveButton,
                                    opacity: isLeaving ? 0.7 : 1,
                                    cursor: isLeaving ? 'not-allowed' : 'pointer'
                                }}
                                disabled={isLeaving}
                            >
                                {isLeaving ? 'Leaving...' : 'Yes, Leave'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CoursesApplied;