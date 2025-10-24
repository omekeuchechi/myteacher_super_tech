import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/Authcontext";
import axios from "axios";
import SideNav from "../../components/instructorCom/sideNav";
import MainFrame from "../../components/instructorCom/mainFrame";
import Card from "../../components/instructorCom/card";
import './mycourses.css';


const API_BASE = import.meta.env.VITE_BASEURL;


const MyCourses = () => {
    const { user } = useContext(AuthContext);
    const [lectures, setLectures] = useState([]);
    const [students, setStudents] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedLectures, setExpandedLectures] = useState({});


    useEffect(() => {
        const fetchLectures = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${API_BASE}/instructor/view-lectures`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setLectures(response.data);
            } catch (err) {
                console.error('Error fetching lectures:', err);
                setError(err.response?.data?.message || 'Failed to fetch lectures');
            } finally {
                setLoading(false);
            }
        };

        if (user.isAdmin) {
            fetchLectures();
        }
    }, [user]);

    const fetchStudentNames = async (studentIds) => {
        try {
            const uniqueIds = [...new Set(studentIds)];
            const response = await fetch(`${API_BASE}/instructor/particular-students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ studentIds: uniqueIds })
            });
            const data = await response.json();
            if (response.ok) {
                const studentsMap = data.students.reduce((acc, student) => {
                    acc[student._id] = student.name || student.email;
                    return acc;
                }, {});
                setStudents(prev => ({ ...prev, ...studentsMap }));
            }
        } catch (error) {
            console.error('Error fetching student names:', error);
        }
    };

    useEffect(() => {
        if (lectures.length > 0) {
            const allStudentIds = lectures.flatMap(lecture =>
                lecture.studentsEnrolled || []
            );
            fetchStudentNames(allStudentIds);
        }
    }, [lectures]);

    if (loading) {
        return <div>Loading lectures...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Add this function to format the date
    const formatTime = (timestamp) => {
        if (!timestamp) return 'No time set';
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };


    return (
        <div className="mycourses-container">
            <SideNav
                isMobileMenuOpen={isMobileMenuOpen}
                onMenuToggle={setIsMobileMenuOpen}
            />
            <MainFrame isMobileMenuOpen={isMobileMenuOpen} className="lectures-container">
                <h1>My Courses</h1>
                {lectures.length === 0 ? (
                    <p>No lectures found</p>
                ) : (
                    <div className="lectures-wrapper">
                        {lectures.map((lecture) => {
                            const isExpanded = expandedLectures[lecture._id] || false;

                            return (
                                <div key={lecture._id} className="lecture-card">
                                    <h3>{lecture.title}</h3>
                                    <div className="midle-section">
                                        <p>Start Time: {formatTime(lecture.startTime)}</p>
                                        <p>{lecture.platform}</p>
                                    </div>
                                    <div className="down-section">
                                       <div className="d-btn-section">
                                         <p>Expire Date: {formatTime(lecture.expiringDate)}</p>
                                        <i
                                            className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}
                                            id="student-show-btn"
                                            onClick={() => setExpandedLectures(prev => ({
                                                ...prev,
                                                [lecture._id]: !isExpanded
                                            }))}
                                        ></i>
                                       </div>

                                        {isExpanded && (
                                            <div id="students-in-lectures">
                                                {lecture.studentsEnrolled?.map((studentId) => (
                                                    <p key={studentId}>
                                                        {students[studentId] || `Student (${studentId.slice(-4)})`}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </MainFrame>
        </div>
    );
};

export default MyCourses;