import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/Authcontext";

const PerLecture = () => {
    const location = useLocation();
    const { lectureId } = useParams();
    const [lecture, setLecture] = useState(location.state?.lecture || null);
    const [loading, setLoading] = useState(!lecture);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLecture = async () => {
            if (lecture) return; // Skip if we already have the lecture data
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_BASEURL}/lectures/${lectureId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch lecture details');
                }
                
                setLecture(data.lecture);
            } catch (err) {
                setError(err.message || 'Error loading lecture');
                toast.error(err.message || 'Error loading lecture');
            } finally {
                setLoading(false);
            }
        };

        fetchLecture();
    }, [lectureId, lecture]);

    const handleJoinLecture = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmJoin = () => {
        setShowConfirmModal(false);
        navigate(`/online-class`);
    };

    if (loading) return <div>Loading lecture details...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!lecture) return <div>Lecture not found</div>;

    return (
        <div className="lecture-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ marginBottom: '1.5rem' }}>{lecture.title}</h1>
                <button 
                    onClick={handleJoinLecture} 
                    style={{ 
                        padding: '0.5rem 1rem', 
                        backgroundColor: 'var(--primary-color)', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer', 
                        fontSize: '1.3rem' 
                    }}
                >
                    Join Lecture
                </button>
            </div>
            
            <div style={{ 
                backgroundColor: 'var(--card-bg, #f8f9fa)', 
                padding: '1.5rem', 
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2rem'
            }}>
                {lecture.description && <p style={{ marginBottom: '1rem', width: '100%' }}>{lecture.description}</p>}
                
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div>
                        <h4>Start Time</h4>
                        <p>{new Date(lecture.startTime).toLocaleString()}</p>
                    </div>
                    <div>
                        <h4>End Time</h4>
                        <p>{new Date(lecture.expiringDate).toLocaleString()}</p>
                    </div>
                    {lecture.lecturesListed?.[0]?.name && (
                        <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
                            <h4>Instructor</h4>
                            <p>{lecture.lecturesListed[0].name}</p>
                        </div>
                    )}
                    {lecture.studentsEnrolled?.[0]?.name && (
                        <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
                            <h4>Students Enrolled</h4>
                            <p>{lecture.studentsEnrolled[0].name}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{ marginTop: 0 }}>Confirm Join</h3>
                        <p>Are you sure you want to join this lecture?</p>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'flex-end', 
                            gap: '1rem', 
                            marginTop: '1.5rem' 
                        }}>
                            <button 
                                onClick={() => setShowConfirmModal(false)}
                                style={{ 
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#e2e8f0',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmJoin}
                                style={{ 
                                    padding: '0.5rem 1rem',
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Join Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerLecture;