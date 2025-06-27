import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { fromEvent } from 'file-selector';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../assets/styles/dashboard/assignment.css';
import DashMobileNav from '../components/userDashCom/dashMobileNav';
import Header from '../components/userDashCom/header';
import FullscreenIcon from '../components/userDashCom/fullscreenIcon';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/Authcontext';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

// Helper to decode JWT
const decodeToken = (token) => {
    if (!token) return null;
    try {
        // Decode the payload of the JWT
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        console.error('Failed to decode token:', e);
        return null;
    }
};

// Helper to get user ID from a decoded token
const getUserIdFromToken = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) return null;
    // The backend uses id, userId, or _id in the token payload
    return decoded.id || decoded.userId || decoded._id;
};

// Helper to convert file to base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// Modal Component for Submission
const SubmissionModal = ({ assignment, onClose, onSubmitted }) => {
    const token = localStorage.getItem('token');
    const [submissionText, setSubmissionText] = useState(assignment.userSubmission?.submission || '');
    const [submissionFiles, setSubmissionFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [justSubmitted, setJustSubmitted] = useState(false);
    const [error, setError] = useState('');

    const isEditing = !!assignment.userSubmission;

    const onDrop = useCallback(acceptedFiles => {
        setSubmissionFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        getDataTransferItems: fromEvent
    });

    const handleFolderChange = (e) => {
        if (e.target.files) {
            setSubmissionFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (assignment.submitType === 'text' && !submissionText) {
            setError('A text submission is required.');
            return;
        }
        if (assignment.submitType === 'file' && submissionFiles.length === 0 && !isEditing) {
            setError('A file submission is required for a new submission.');
            return;
        }
        if (assignment.submitType === 'both' && !submissionText && submissionFiles.length === 0 && !isEditing) {
            setError('Either text or a file must be submitted.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const filesPayload = [];
            if (submissionFiles.length > 0) {
                const base64Files = await Promise.all(
                    submissionFiles.map(file => toBase64(file))
                );
                filesPayload.push(...base64Files);
            }

            const payload = {
                submission: submissionText,
                files: filesPayload,
            };

            let res;
            if (isEditing) {
                payload.submissionId = assignment.userSubmission._id;
                res = await axios.patch(`${API_BASE}/assignments/${assignment._id}/update-submission`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                res = await axios.post(`${API_BASE}/assignments/${assignment._id}/submit`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            if (res.data.success) {
                onSubmitted(assignment._id, res.data.data);
                setJustSubmitted(true);
            } else {
                setError(res.data.message || 'An unknown error occurred.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit assignment.');
            console.error('Submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const dropzoneStyle = {
        border: '2px dashed #ccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        marginBottom: '1rem',
        backgroundColor: isDragActive ? '#f0f0f0' : '#fafafa'
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    {isEditing ? 'Edit Submission' : 'Submit'}: {assignment.assignmentName}
                </h2>
                {justSubmitted ? (
                    <div>
                        <p style={{ color: 'green', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>{isEditing ? 'Updated!' : 'Submitted!'}</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                            <button onClick={() => setJustSubmitted(false)} style={{ padding: '0.5rem 1rem', backgroundColor: '#4F46E5', color: 'white', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
                                Edit Again
                            </button>
                            <button onClick={onClose} style={{ padding: '0.5rem 1rem', backgroundColor: '#E5E7EB', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {(assignment.submitType === 'text' || assignment.submitType === 'both') && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label htmlFor="submissionText" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Your Submission</label>
                                <textarea
                                    id="submissionText"
                                    value={submissionText}
                                    onChange={(e) => setSubmissionText(e.target.value)}
                                    rows="5"
                                    style={{ marginTop: '0.25rem', width: '100%', borderRadius: '0.375rem', border: '1px solid #D1D5DB', padding: '0.5rem' }}
                                    placeholder="Type your response here..."
                                />
                            </div>
                        )}
                        {(assignment.submitType === 'file' || assignment.submitType === 'both') && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Upload Files</label>
                                <div {...getRootProps({ style: dropzoneStyle })}>
                                    <input {...getInputProps()} />
                                    {isDragActive ?
                                        <p>Drop the files here...</p> :
                                        <p>Drag 'n' drop files here, or click to select files</p>
                                    }
                                </div>

                                <label htmlFor="folderUpload" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginTop: '1rem' }}>Upload Folder</label>
                                <input
                                    type="file"
                                    id="folderUpload"
                                    onChange={handleFolderChange}
                                    style={{ marginTop: '0.25rem', width: '100%' }}
                                    webkitdirectory=""
                                    directory=""
                                />
                                
                                {submissionFiles.length > 0 && (
                                    <div style={{marginTop: '1rem'}}>
                                        <strong>Selected files:</strong>
                                        <ul style={{listStyle: 'none', padding: 0, maxHeight: '100px', overflowY: 'auto'}}>
                                            {submissionFiles.map((file, i) => <li key={i}>{file.name}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {isEditing && <p style={{fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem'}}>Leave blank to keep existing file(s).</p>}
                            </div>
                        )}
                        {error && <p style={{ color: '#EF4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem', backgroundColor: '#E5E7EB', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" disabled={isSubmitting} style={{ padding: '0.5rem 1rem', backgroundColor: '#4F46E5', color: 'white', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', opacity: isSubmitting ? 0.5 : 1 }}>
                                {isSubmitting ? 'Submitting...' : (isEditing ? 'Update' : 'Submit')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

// Helper component for navigation items
function NavItem({ icon, label, isExpanded, move, onClick, theme }) {
  const className = `nav-item ${theme}`;

  const content = (
    <>
      <i
        className={`fas fa-${icon}`}
        style={{
          fontSize: '22px',
          marginRight: isExpanded ? '12px' : '0',
        }}
      ></i>
      {isExpanded && <span style={{ fontSize: '16px' }}>{label}</span>}
    </>
  );

  if (move) {
    return (
      <Link className={className} to={move} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <div className={className} onClick={onClick} style={{ cursor: 'pointer' }}>
      {content}
    </div>
  );
}

const AssignmentPage = () => {
    const { logout } = useContext(AuthContext);
    const [isExpanded, setIsExpanded] = useState(true);
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleSidebar = () => {
        setIsExpanded(prev => !prev);
    };

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const isLightMode = theme === 'light';

    const token = localStorage.getItem('token');
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const fetchAssignments = useCallback(async () => {
        if (!token) {
            setError("Authentication token not found. Please log in.");
            setIsLoading(false);
            return;
        }

        const userId = getUserIdFromToken(token);
        if (!userId) {
            setError("Could not identify user from token. Please log in again.");
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/assignments/my-assignments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                // For each assignment, find the submission belonging to the current user
                const assignmentsWithSubmissionState = res.data.data.map(assignment => {
                    const userSubmission = assignment.submissions?.find(
                        sub => sub.student.toString() === userId.toString()
                    );
                    return { ...assignment, userSubmission: userSubmission || null };
                });
                setAssignments(assignmentsWithSubmissionState);
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch assignments.');
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    const handleSubmissionSuccess = (assignmentId, submissionData) => {
        setAssignments(prevAssignments =>
            prevAssignments.map(assignment =>
                assignment._id === assignmentId
                    ? { ...assignment, userSubmission: submissionData }
                    : assignment
            )
        );
        // The modal is kept open to show a success message and allow further edits.
    };

    const handleOpenModal = (assignment) => {
        setSelectedAssignment(assignment);
    };

    return (
        <div className={`assignment-page-container ${theme}`}>
            <DashMobileNav theme={theme} />
            <Header theme={theme} />

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
            </button>

            <div className={`sidebar ${isExpanded ? '' : 'collapsed'}`}>
                <button onClick={toggleSidebar} className="toggle-button">
                    <i className={`fas ${isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
                </button>
                <nav className="nav">
                    <FullscreenIcon />
                    <NavItem icon="home" label="Home" move="/" isExpanded={isExpanded} theme={theme} />
                    <NavItem icon="chart-bar" label="Dashboard" isExpanded={isExpanded} move="/dashboard" theme={theme} />
                    <NavItem icon="user" label="Profile" move="/profile" isExpanded={isExpanded} theme={theme} />
                    <NavItem icon="chalkboard-teacher" label="Online Class" isExpanded={isExpanded} move="/online-class" theme={theme} />
                    <NavItem icon="briefcase" label="Assets" move="/assets" isExpanded={isExpanded} theme={theme} />
                    <NavItem icon="book" label="Assignment" move="/assignment" isExpanded={isExpanded} theme={theme} />
                    <NavItem icon="cog" label="Settings" move="/settings" isExpanded={isExpanded} theme={theme} />
                    <NavItem icon="question-circle" label="Help" isExpanded={isExpanded} move="#" theme={theme} />
                    <NavItem icon="right-from-bracket" label="Log Out" isExpanded={isExpanded} onClick={logout} theme={theme} />
                </nav>
            </div>

            <div className="main-content">
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>My Assignments</h1>
                {isLoading ? (
                    <p>Loading assignments...</p>
                ) : error ? (
                    <p style={{ color: '#EF4444' }}>Error: {error}</p>
                ) : assignments.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {assignments.map(assignment => {
                            const hasSubmitted = !!assignment.userSubmission;
                            return (
                                <div key={assignment._id} className="assignment-card">
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>{assignment.assignmentName}</h3>
                                        <p style={{ color: '#4B5563', margin: '0.25rem 0 0 0' }}>Course: {assignment.targetBatch.title}</p>
                                        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0.25rem 0 0 0' }}>Due: {new Date(assignment.expiringDate).toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleOpenModal(assignment)}
                                        className={`submit-button ${hasSubmitted ? 'submitted' : ''}`}
                                    >
                                        {hasSubmitted ? 'Edit Submission' : 'Submit'}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#6B7280', marginTop: '2rem' }}>You have no pending assignments. Great job!</p>
                )}

                {selectedAssignment && (
                    <SubmissionModal
                        assignment={selectedAssignment}
                        onClose={() => setSelectedAssignment(null)}
                        onSubmitted={handleSubmissionSuccess}
                    />
                )}
            </div>
        </div>
    );
};

export default AssignmentPage;
