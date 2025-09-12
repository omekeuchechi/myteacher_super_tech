import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/Authcontext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from '../../assets/styles/dashboard/CoursesApplied.module.css';

const API_BASE = import.meta.env.VITE_BASEURL;

const CoursesApplied = ({ theme }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [isLeaving, setIsLeaving] = useState(false);

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

    if (loading) return <div className={theme === 'dark' ? styles.dark : ''} style={{ color: theme === 'dark' ? 'white' : 'inherit' }}>Loading lectures...</div>;
    if (error) return <div className={theme === 'dark' ? styles.dark : ''} style={{ color: '#e53e3e' }}>Error: {error}</div>;
    
    return (
        <div className={`${styles.container} ${theme === 'dark' ? styles.dark : ''}`}>
            <h2 className={styles.heading}>My Lectures</h2>
            <div className={styles.swiperContainer}>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }}
                >
                    {lectures.length === 0 ? (
                        <p style={{ color: theme === 'dark' ? '#a0aec0' : 'inherit' }}>No lectures found.</p>
                    ) : (
                        lectures.map((lecture) => {
                            const startTime = new Date(lecture.startTime).toLocaleString();
                            const endTime = new Date(lecture.expiringDate).toLocaleString();
                            
                            return (
                                <SwiperSlide key={lecture._id}>
                                    <div 
                                        className={styles.card}
                                        onMouseOver={e => {
                                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                            e.currentTarget.style.transform = 'none';
                                        }}
                                    >
                                        <h3 className={styles.title}>{lecture.title}</h3>
                                        <p className={styles.description}>{lecture.description}</p>
                                        <div className={styles.time}>
                                            <p>Starts: {startTime}</p>
                                            <p>Ends: {endTime}</p>
                                        </div>
                                        {lecture.lecturesListed?.[0]?.name && (
                                            <p className={styles.instructor}>
                                                Instructor: {lecture.lecturesListed[0].name}
                                            </p>
                                        )}
                                        <div className={styles.buttonGroup}>
                                            <button 
                                                onClick={() => navigate(`/per-lecture/${lecture._id}`, {state: {lecture}})}
                                                className={styles.button}
                                            >
                                                View Lecture
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLeaveClick(lecture._id);
                                                }}
                                                className={`${styles.button} ${styles.leaveButton}`}
                                                disabled={isLeaving}
                                            >
                                                {isLeaving ? 'Leaving...' : 'Leave Lecture'}
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })
                    )}
                </Swiper>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.modalTitle}>Leave Lecture</h3>
                        <p style={{ color: theme === 'dark' ? '#cbd5e0' : '#4a5568' }}>
                            Are you sure you want to leave this lecture? This action cannot be undone.
                        </p>
                        <div className={styles.modalButtons}>
                            <button 
                                onClick={handleCancelLeave}
                                className={styles.cancelButton}
                                disabled={isLeaving}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmLeave}
                                className={`${styles.button} ${styles.leaveButton}`}
                                style={{
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
        </div>
    );
};

export default CoursesApplied;