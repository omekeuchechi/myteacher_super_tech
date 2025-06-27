import React, { useState, useEffect, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminNav from "../../components/adminCom/navSection";
import { AuthContext } from '../../../context/Authcontext';
import '../../assets/styles/admin/enrollment.css';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const Enrollments = () => {
  const { logout } = useContext(AuthContext);
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/admin/ui-settings", label: "UI Settings" },
    { to: "/admin/take-lecture", label: "Take Lecture" },
    { to: "/admin/profile", label: "Profile" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/transactions", label: "Transactions" },
    { to: "/admin/enrollments", label: "Enrollment" },
    { to: "/admin/admin-list", label: "Admin List" },
    { to: "/admin/contact-messages", label: "Contact Messages" },
    { to: "/admin/publish-asset", label: "Publish Asset" },
    { to: "/admin/post-blog", label: "Post Blog" },
  ];
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                const response = await fetch(`${API_BASE}/enrollment/list`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch enrollments');
                }

                const data = await response.json();
                const enrollmentsWithAvatar = data.enrollments.map(enrollment => {
                    if (enrollment.userId) {
                        enrollment.userId.avatar = enrollment.userId.avatar || null;
                    }
                    return enrollment;
                });
                setEnrollments(enrollmentsWithAvatar || []);
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    if (loading) {
        return (
          <div className="loading-state">
            <p>Loading enrollments...</p>
          </div>
        );
    }

    if (error) {
        return (
          <div className="error-state">
            <p>Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Retry
            </button>
          </div>
        );
    }

    const filteredEnrollments = enrollments.filter(enrollment => {
        const term = searchTerm.toLowerCase();
        const studentName = enrollment.userId?.name?.toLowerCase() || '';
        const studentEmail = enrollment.userId?.email?.toLowerCase() || '';
        const courseName = enrollment.courseId?.course?.toLowerCase() || '';
        return studentName.includes(term) || studentEmail.includes(term) || courseName.includes(term);
    });

    const processedEnrollments = filteredEnrollments
        .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
        .slice(0, 200);

    return (
      <>
        <AdminNav navLinks={navLinks} onLogout={logout} />
        <div className="enrollment-container">
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
          <h1>Course Enrollments</h1>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name, email, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {processedEnrollments.length === 0 ? (
            <div className="empty-state">
              <p>No matching enrollments found.</p>
            </div>
          ) : (
            <div className="enrollment-list">
              {processedEnrollments.map((enrollment) => (
                <div key={enrollment._id} className="enrollment-card">
                  <div className="avatar-container">
                    {enrollment.userId?.avatar ? (
                      <img
                        src={enrollment.userId.avatar}
                        alt={enrollment.userId.name}
                        className="avatar"
                      />
                    ) : (
                      <div className="avatar-fallback">
                        <span>
                          {enrollment.userId?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="enrollment-content">
                    <h3 className="student-name">{enrollment.userId?.name || 'Unknown User'}</h3>
                    <div className="student-email">{enrollment.userId?.email || 'No email provided'}</div>
                    
                    <div className="course-info">
                      <span className="course-name">
                        {enrollment.courseId?.course || 'N/A'}
                      </span>
                      <div className="enrollment-date">
                        <span>Enrolled on</span>
                        <span>{new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
};

export default Enrollments;