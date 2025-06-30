import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { fromEvent } from 'file-selector';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaBold, FaItalic, FaListUl, FaListOl, FaLink, FaPaperclip, FaCode, FaQuoteLeft, FaUnderline } from 'react-icons/fa';
import { MdTitle, MdOutlineTitle } from 'react-icons/md';
import { BiCodeBlock } from 'react-icons/bi';
import ReactMarkdown from 'react-markdown';
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

// Helper function to format text with prefix and suffix
const formatText = (prefix, suffix = '', textarea) => {
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    const newText = beforeText + prefix + selectedText + suffix + afterText;
    
    // Set cursor position after the inserted text
    const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
    
    return {
        value: newText,
        selectionStart: newCursorPos,
        selectionEnd: newCursorPos
    };
};

// Modal Component for Submission
const SubmissionModal = ({ assignment, onClose, onSubmitted }) => {
    const token = localStorage.getItem('token');
    const textareaRef = useRef(null);
    const [submissionText, setSubmissionText] = useState(assignment.userSubmission?.submission || '');
    const [submissionFiles, setSubmissionFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [justSubmitted, setJustSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isPreview, setIsPreview] = useState(false);

    const isEditing = !!assignment.userSubmission;

    const onDrop = useCallback(acceptedFiles => {
        setSubmissionFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        getDataTransferItems: fromEvent
    });

    const handleFormatClick = (prefix, suffix = '') => {
        if (!textareaRef.current) return;
        
        const result = formatText(prefix, suffix, textareaRef.current);
        if (result) {
            setSubmissionText(result.value);
            // Update cursor position after state update
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = result.selectionStart;
                    textareaRef.current.selectionEnd = result.selectionEnd;
                    textareaRef.current.focus();
                }
            }, 0);
        }
    };

    const handleFolderChange = (e) => {
        if (e.target.files) {
            setSubmissionFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
        }
    };
    
    const removeFile = (index) => {
        setSubmissionFiles(prev => prev.filter((_, i) => i !== index));
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
        margin: '0.5rem 0',
        backgroundColor: isDragActive ? '#f0f8ff' : '#f8f9fa',
        transition: 'background-color 0.2s, border-color 0.2s',
        borderColor: isDragActive ? '#4dabf7' : '#ccc'
    };

    const formatButtons = [
        { icon: <FaBold />, action: () => handleFormatClick('**', '**'), title: 'Bold (Ctrl+B)' },
        { icon: <FaItalic />, action: () => handleFormatClick('*', '*'), title: 'Italic (Ctrl+I)' },
        { icon: <FaUnderline />, action: () => handleFormatClick('~~', '~~'), title: 'Strikethrough' },
        { icon: <FaLink />, action: () => {
            const url = prompt('Enter URL:');
            if (url) {
                const text = prompt('Enter link text (optional):', url);
                handleFormatClick(`[${text || url}](`, ')');
            }
        }, title: 'Insert Link' },
        { icon: <FaListUl />, action: () => handleFormatClick('- ', ''), title: 'Bulleted List' },
        { icon: <FaListOl />, action: () => handleFormatClick('1. ', ''), title: 'Numbered List' },
        { icon: <FaQuoteLeft />, action: () => handleFormatClick('> ', ''), title: 'Quote' },
        { icon: <MdTitle />, action: () => handleFormatClick('# ', ''), title: 'Heading 1' },
        { icon: <MdOutlineTitle />, action: () => handleFormatClick('## ', ''), title: 'Heading 2' },
        { icon: <BiCodeBlock />, action: () => handleFormatClick('```\n', '\n```'), title: 'Code Block' }
    ];

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="submission-modal">
                <div className="modal-header">
                    <h2>{isEditing ? 'Edit Submission' : 'Submit'}: {assignment.assignmentName}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                
                {justSubmitted ? (
                    <div className="success-message">
                        <div className="success-icon">✓</div>
                        <h3>{isEditing ? 'Updated Successfully!' : 'Submitted Successfully!'}</h3>
                        <p>Your submission has been {isEditing ? 'updated' : 'received'}.</p>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setJustSubmitted(false)}>
                                Edit Again
                            </button>
                            <button className="btn btn-primary" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="submission-form">
                        {(assignment.submitType === 'text' || assignment.submitType === 'both') && (
                            <div className="form-section">
                                <div className="form-header">
                                    <label>Your Submission</label>
                                    <div className="format-tabs">
                                        <button 
                                            type="button" 
                                            className={`tab-button ${!isPreview ? 'active' : ''}`}
                                            onClick={() => setIsPreview(false)}
                                        >
                                            Write
                                        </button>
                                        <button 
                                            type="button" 
                                            className={`tab-button ${isPreview ? 'active' : ''}`}
                                            onClick={() => setIsPreview(true)}
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </div>
                                
                                {!isPreview ? (
                                    <div className="editor-container">
                                        <div className="toolbar">
                                            {formatButtons.map((btn, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    className="format-button"
                                                    onClick={btn.action}
                                                    title={btn.title}
                                                >
                                                    {btn.icon}
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            ref={textareaRef}
                                            id="submissionText"
                                            value={submissionText}
                                            onChange={(e) => setSubmissionText(e.target.value)}
                                            className="submission-textarea"
                                            placeholder="Type your response here... (supports Markdown formatting)"
                                            rows={10}
                                        />
                                    </div>
                                ) : (
                                    <div className="preview-container">
                                        <ReactMarkdown>{submissionText || '*No content to preview*'}</ReactMarkdown>
                                    </div>
                                )}
                                
                                <div className="format-hint">
                                    <small>Format with: **bold**, *italic*, ~~strikethrough~~, `code`, ```code block```, &gt; quote, # heading</small>
                                </div>
                            </div>
                        )}

                        {(assignment.submitType === 'file' || assignment.submitType === 'both') && (
                            <div className="form-section">
                                <label className="section-label">Upload Files</label>
                                
                                <div {...getRootProps({ className: 'dropzone', style: dropzoneStyle })}>
                                    <input {...getInputProps()} />
                                    <div className="dropzone-content">
                                        <FaPaperclip size={24} className="upload-icon" />
                                        <p className="dropzone-text">Drag & drop files here, or click to browse</p>
                                        <p className="dropzone-hint">Supports PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, JPG, PNG, GIF (max 20MB)</p>
                                    </div>
                                </div>

                                <div className="folder-upload">
                                    <label className="file-input-label">
                                        <span>Or upload a folder:</span>
                                        <input
                                            type="file"
                                            id="folderUpload"
                                            onChange={handleFolderChange}
                                            webkitdirectory=""
                                            directory=""
                                        />
                                    </label>
                                </div>
                                
                                {submissionFiles.length > 0 && (
                                    <div className="file-list">
                                        <div className="file-list-header">
                                            <span>Selected Files ({submissionFiles.length})</span>
                                        </div>
                                        <ul>
                                            {submissionFiles.map((file, i) => (
                                                <li key={i} className="file-item">
                                                    <span className="file-name">{file.name}</span>
                                                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                                                    <button 
                                                        type="button" 
                                                        className="remove-file"
                                                        onClick={() => removeFile(i)}
                                                        title="Remove file"
                                                    >
                                                        ×
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {isEditing && (
                                    <p className="file-note">
                                        <i className="fas fa-info-circle"></i> Leave blank to keep existing files
                                    </p>
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-circle"></i>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={isSubmitting || (!submissionText && submissionFiles.length === 0)}
                            >
                                {isSubmitting ? (
                                    <span className="submit-loading">
                                        <span className="spinner"></span>
                                        {isEditing ? 'Updating...' : 'Submitting...'}
                                    </span>
                                ) : isEditing ? 'Update Submission' : 'Submit Assignment'}
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
        <div className={`assignment-page-container ${theme}`} style={{ backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff' }}>
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
                                <div key={assignment._id} className={theme === 'dark' ? 'assignment-card dark' : 'assignment-card light'}>
                                    <div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0, color: `${theme === 'dark' ? '#fff' : '#000'}` }}>{assignment.assignmentName}</h3>
                                        <p style={{ color: `${theme === 'dark' ? '#fff' : '#000'}`, margin: '0.25rem 0 0 0', fontSize: '1.5rem' }}>Course: {assignment.targetBatch.title}</p>
                                        <p style={{ fontSize: '1.5rem', color: `${theme === 'dark' ? '#fff' : '#000'}`, margin: '0.25rem 0 0 0' }}>Due: {new Date(assignment.expiringDate).toLocaleString()}</p>
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
