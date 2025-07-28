import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import axios from 'axios'; // Using axios for API requests
import '../../assets/styles/admin/assignmentCorrections.css';
import AdminNav from "../../components/adminCom/navSection";    
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/Authcontext";

const API_BASE = import.meta.env.VITE_BASEURL;

const navLinks = [
    { to: "/", label: "Home" },
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/ui-settings", label: "UI Settings" },
    { to: "/admin/take-lecture", label: "Take Lecture" },
    { to: "/admin/profile", label: "Profile" },
    // { to: "/admin/users", label: "Users" },
    // { to: "/admin/transactions", label: "Transactions" },
    { to: "/admin/enrollments", label: "Enrollment" },
    { to: "/admin/admin-list", label: "Admin List" },
    { to: "/admin/contact-messages", label: "Contact Messages" },
    { to: "/admin/create-assignment", label: "Create Assignment" },
    { to: "/admin/assignment-corrections", label: "Assignment Corrections" },
    // { to: "/admin/publish-asset", label: "Publish Asset" },
    // { to: "/admin/post-blog", label: "Post Blog" },
    // { to: "/admin/mailer", label: "Mailer" },
  ];

const AssignmentCorrections = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isGrading, setIsGrading] = useState(false);
    const { logout } = useContext(AuthContext);

    // Assume the token is stored in localStorage after login
    const authToken = localStorage.getItem('token');

        const api = useMemo(() => axios.create({
        baseURL: `${API_BASE}/certificates`,
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }), [authToken]);

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        setError(''); // Clear previous errors on new fetch
        try {
            const response = await api.get('/admin/submissions');
            if (response.data.success) {
                setSubmissions(response.data.submissions);
            } else {
                setError(response.data.message || 'Failed to fetch submissions.');
            }
        } catch (err) {
            setError('An error occurred while fetching submissions. Please check your connection or login status.');
            console.error('Fetch Submissions Error:', err);
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        if (authToken) {
            fetchSubmissions();
        } else {
            setLoading(false);
            setError("Authentication token not found. Please log in.");
        }
    }, [fetchSubmissions, authToken]);

    const handleGradeNow = async () => {
        if (!window.confirm('Are you sure you want to trigger AI grading for all new submissions?')) {
            return;
        }

        setIsGrading(true);
        setNotification({ message: '', type: '' });
        try {
            const response = await api.post('/grade-now');
            if (response.data.success) {
                setNotification({ message: response.data.message, type: 'success' });
                // Refresh the list to show updated statuses
                fetchSubmissions();
            } else {
                setNotification({ message: response.data.message || 'Grading process failed.', type: 'error' });
            }
        } catch (err) {
            setNotification({ message: 'An error occurred while triggering the grading process.', type: 'error' });
            console.error('Grade Now Error:', err);
        } finally {
            setIsGrading(false);
        }
    };

    if (loading) {
        return <div className="loading-container">Loading submissions...</div>;
    }

    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

    return (
        <>
        <AdminNav navLinks={navLinks} onLogout={logout} />
        <div className="admin-submissions-container">
            <h1>Student Assignment Submissions</h1>
            
            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <div className="actions-header">
                <button onClick={handleGradeNow} disabled={isGrading}>
                    {isGrading ? 'Grading in Progress...' : 'Grade All New Submissions'}
                </button>
            </div>

            {submissions.length === 0 ? (
                <p>No submissions found for your managed lectures.</p>
            ) : (
                <table className="submissions-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Assignment</th>
                            <th>Batch</th>
                            <th>Submitted At</th>
                            <th>Status</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((sub, index) => (
                            <tr key={sub.assignmentId + sub.studentId + index}>
                                <td>{sub.studentName || 'N/A'}</td>
                                <td>{sub.assignmentName}</td>
                                <td>{sub.batchName}</td>
                                <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                                <td>
                                    <span className={sub.graded ? 'status-graded' : 'status-pending'}>
                                        {sub.graded ? 'Graded' : 'Pending'}
                                    </span>
                                    {console.log(sub.graded)}
                                </td>
                                <td>{sub.graded ? sub.score : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        </>
    );
};

export default AssignmentCorrections;
