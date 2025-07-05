import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { FaBold, FaItalic, FaListUl, FaListOl, FaLink, FaPaperPlane, FaQuoteLeft, FaImage, FaAlignLeft, FaAlignCenter, FaAlignRight, FaPalette, FaMinus, FaUndo, FaRedo } from 'react-icons/fa';
import { MdTitle } from 'react-icons/md';
import { BiCodeBlock } from 'react-icons/bi';
import { marked } from 'marked';

// Local Imports
import { AuthContext } from '../../../context/Authcontext';
import AdminNav from '../../components/adminCom/navSection';

// Styles
import '../../assets/styles/admin/dashboard.css';
import '../../assets/styles/admin/mailer.css';

const API_BASE = import.meta.env.VITE_BASEURL || 'http://localhost:5000/api/v1';

const Mailer = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [htmlMessage, setHtmlMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [emailHistory, setEmailHistory] = useState([]);
  const [totalEmails, setTotalEmails] = useState(0);
  const [useHtml, setUseHtml] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mediaPreview, setMediaPreview] = useState({ src: null, type: null, name: null });
  const [history, setHistory] = useState([message]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('token');

  const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { to: '/admin/users', label: 'Users', icon: 'fas fa-users' },
    // { to: '/admin/enrollments', label: 'Enrollments', icon: 'fas fa-user-check' },
    // { to: '/admin/transactions', label: 'Transactions', icon: 'fas fa-exchange-alt' },
    // { to: '/admin/mailer', label: 'Mailer', icon: 'fas fa-envelope' },
    { to: '/admin/post-blog', label: 'Post Blog', icon: 'fas fa-file-alt' },
    { to: '/admin/publish-asset', label: 'Publish Asset', icon: 'fas fa-upload' },
    { to: '/admin/create-assignment', label: 'Create Assignment', icon: 'fas fa-tasks' },
    { to: '/admin/assignment-corrections', label: 'Assignment Corrections', icon: 'fas fa-check-double' },
    { to: '/admin/take-lecture', label: 'Take Lecture', icon: 'fas fa-chalkboard-teacher' },
    { to: '/admin/contact-messages', label: 'Contact Messages', icon: 'fas fa-inbox' },
    // { to: '/admin/profile', label: 'Profile', icon: 'fas fa-user-cog' },
    // { to: '/admin/admin-list', label: 'Admins', icon: 'fas fa-user-shield' },
    // { to: '/admin/super-admin-list', label: 'Super Admins', icon: 'fas fa-user-tie' },
    // { to: '/admin/ui-settings', label: 'UI Settings', icon: 'fas fa-paint-brush' },
  ];

  // Show snackbar notification
  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar(prev => ({ ...prev, open: false })), 5000);
  }, []);

  // Close snackbar
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Fetch users based on active tab
  // Fetch users based on active tab
  const fetchUsers = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Corrected the endpoint from /users to /user to likely match the backend route.
      let url = `${API_BASE}/user`;
      if (activeTab === 3) { // Specific admin tab
        url += '?role=admin';
      }
      
      const response = await fetch(url, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch users. Status: ${response.status}. Body: ${errorText}`);
      }
      
      const data = await response.json();
      // Merge new users with existing ones to build a comprehensive list
      setUsers(prevUsers => {
        const usersMap = new Map(prevUsers.map(u => [u._id, u]));
        (data.users || []).forEach(user => usersMap.set(user._id, user));
        return Array.from(usersMap.values());
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar(error.message || 'Failed to fetch users', 'danger');
    }
  }, [token, activeTab, navigate, showSnackbar]);

  // Fetch email history
  const fetchEmailHistory = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/mailer/history?page=${page}&limit=${rowsPerPage}`,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch email history');
      }
      
      const data = await response.json();
      setEmailHistory(data.mails || []);
      setTotalEmails(data.total || 0);
    } catch (error) {
      console.error('Error fetching email history:', error);
      showSnackbar('Failed to fetch email history', 'danger');
    }
  }, [token, page, rowsPerPage, navigate, showSnackbar]);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchUsers(), fetchEmailHistory()]);
      } catch (error) {
        console.error('Error loading data:', error);
        showSnackbar('Error loading data', 'danger');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchUsers, fetchEmailHistory, showSnackbar]);

  // Format text with markdown
  const formatText = (prefix, suffix = '') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = message.substring(start, end);
    const beforeText = message.substring(0, start);
    const afterText = message.substring(end);
    
    const newText = selectedText 
      ? `${beforeText}${prefix}${selectedText}${suffix}${afterText}`
      : `${beforeText}${prefix}${suffix}${afterText}`;
    
    setMessage(newText);
    
    // Set cursor position
    setTimeout(() => {
      const newPosition = start + prefix.length;
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition + (selectedText ? selectedText.length : 0));
    }, 0);
  };

  // Handle sending email
  const handleSendEmail = async () => {
    if (!subject || (!message && !htmlMessage && !mediaPreview.src)) {
      showSnackbar('Subject and message/media are required', 'danger');
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      let finalHtml = useHtml ? htmlMessage : marked(message);

      if (mediaPreview.src) {
        let mediaTag = '';
        if (mediaPreview.type === 'image') {
          mediaTag = `<img src="${mediaPreview.src}" alt="${mediaPreview.name}" style="max-width: 100%;" />`;
        } else {
          mediaTag = `<video src="${mediaPreview.src}" controls style="max-width: 100%;">Your browser does not support the video tag.</video>`;
        }
        finalHtml = mediaTag + '<br/><br/>' + finalHtml;
      }

      const data = { 
        subject,
        text: useHtml ? '' : message, // Raw markdown as a fallback
        html: finalHtml
      };
      
      switch (activeTab) {
        case 0: // All users
          endpoint = '/mailer/send-to-all';
          break;
        case 1: // Specific user
          if (!selectedUser) {
            showSnackbar('Please select a user', 'danger');
            setLoading(false);
            return;
          }
          endpoint = `/mailer/send-to-user/${selectedUser}`;
          break;
        case 2: // All admins
          endpoint = '/mailer/send-to-admins';
          break;
        case 3: // Specific admin
          if (!selectedUser) {
            showSnackbar('Please select an admin', 'danger');
            setLoading(false);
            return;
          }
          endpoint = `/mailer/send-to-admin/${selectedUser}`;
          break;
        default:
          break;
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send email');
      }

      await response.json();
      showSnackbar('Email sent successfully!', 'success');
      setSubject('');
      setMessage('');
      setHtmlMessage('');
      setMediaPreview({ src: null, type: null, name: null }); // Clear media preview
      fetchEmailHistory();
    } catch (error) {
      console.error('Error sending email:', error);
      showSnackbar(error.message || 'Failed to send email', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = useCallback((tabIndex) => {
    setActiveTab(tabIndex);
    setSelectedUser('');
    fetchUsers();
  }, [fetchUsers]);

  // Handle message change and update history
  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newMessage);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handle Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setMessage(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Handle Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setMessage(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts for undo/redo
  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      handleUndo();
    }
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      handleRedo();
    }
  }, [handleUndo, handleRedo]);

  // Filter users based on active tab
  // Create a map from user ID to user name for easy lookup
  const userMap = useMemo(() => {
    return new Map(users.map(user => [user._id, user.name]));
  }, [users]);

  // Filter users based on active tab
  const filteredUsers = useMemo(() => {
    if (activeTab === 3) { // Specific admin tab
      return users.filter(user => user.isAdmin || user.isSuperAdmin);
    }
    return users;
  }, [users, activeTab]);

  // Handle file upload for media preview
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      showSnackbar('Please select an image or video file.', 'danger');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    setLoading(true);

    reader.onload = (e) => {
      setMediaPreview({
        src: e.target.result,
        type: isImage ? 'image' : 'video',
        name: file.name,
      });
      setShowPreview(true);
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      showSnackbar('Failed to read file.', 'danger');
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsDataURL(file);
  };

  // Markdown Toolbar Component
  const MarkdownToolbar = useCallback(() => (
    <div className="markdown-toolbar">
      <div className="toolbar-group">
        <button type="button" className="btn" onClick={() => formatText('**', '**')} title="Bold"><FaBold /></button>
        <button type="button" className="btn" onClick={() => formatText('*', '*')} title="Italic"><FaItalic /></button>
        <button type="button" className="btn" onClick={() => formatText('### ', '')} title="Heading"><MdTitle /></button>
      </div>
      <div className="toolbar-group">
        <button type="button" className="btn" onClick={() => formatText('> ', '')} title="Blockquote"><FaQuoteLeft /></button>
        <button type="button" className="btn" onClick={() => formatText('- ', '')} title="Bullet List"><FaListUl /></button>
        <button type="button" className="btn" onClick={() => formatText('1. ', '')} title="Numbered List"><FaListOl /></button>
      </div>
      <div className="toolbar-group">
        <button type="button" className="btn" onClick={() => formatText('[Link Text](', ')')} title="Link"><FaLink /></button>
        <button type="button" className="btn" onClick={() => formatText('```\n', '\n```')} title="Code Block"><BiCodeBlock /></button>
        <button type="button" className="btn" onClick={() => formatText('\n---\n', '')} title="Horizontal Rule"><FaMinus /></button>
      </div>
      <div className="toolbar-group">
        <button type="button" className="btn" onClick={() => formatText('<p style="text-align: left;">', '</p>')} title="Align Left"><FaAlignLeft /></button>
        <button type="button" className="btn" onClick={() => formatText('<p style="text-align: center;">', '</p>')} title="Align Center"><FaAlignCenter /></button>
        <button type="button" className="btn" onClick={() => formatText('<p style="text-align: right;">', '</p>')} title="Align Right"><FaAlignRight /></button>
      </div>
      <div className="toolbar-group">
        <button type="button" className="btn" onClick={() => {
          const color = prompt('Enter a background color (e.g., #ff0000 or yellow):');
          if (color) formatText(`<span style="background-color: ${color};">`, '</span>');
        }} title="Background Color"><FaPalette /></button>
        <button type="button" className="btn" onClick={() => fileInputRef.current && fileInputRef.current.click()} title="Upload Media"><FaImage /></button>
      </div>
      <div className="toolbar-group">
        <button type="button" className="btn" onClick={handleUndo} title="Undo (Ctrl+Z)" disabled={historyIndex === 0}><FaUndo /></button>
        <button type="button" className="btn" onClick={handleRedo} title="Redo (Ctrl+Y)" disabled={historyIndex === history.length - 1}><FaRedo /></button>
      </div>
      <div className="toolbar-group">
        <button type="button" className="btn btn-preview" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>
    </div>
  ), [message, showPreview]);

  // Rest of your JSX remains the same...
  // [Previous JSX code]

  const totalPages = Math.ceil(totalEmails / rowsPerPage);

  return (
    <div className="admin-dashboard">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        accept="image/*,video/*"
      />
      <AdminNav navLinks={navLinks} onLogout={logout} />
      <main className="mailer-main-content">
        {/* Snackbar for notifications */}
        {snackbar.open && (
          <div 
            className={`snackbar show alert alert-${snackbar.severity}`}
            role="alert"
          >
            {snackbar.message}
            <button type="button" className="btn-close" onClick={handleCloseSnackbar}></button>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        <div className="mailer-container">
          <h1 className="mailer-title">Mailer</h1>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            {['All Users', 'Specific User', 'All Admins', 'Specific Admin'].map((tabName, index) => (
              <li className="nav-item" key={index}>
                <button
                  className={`nav-link ${activeTab === index ? 'active' : ''}`}
                  onClick={() => handleTabChange(index)}
                >
                  {tabName}
                </button>
              </li>
            ))}
          </ul>

          <div className="mailer-layout-grid">
            {/* Email Composer */}
            <div>
              <div className="mailer-card">
                <div className="mailer-card-body">
                  <h5 className="mailer-card-title">Compose Email</h5>
                  
                  {(activeTab === 1 || activeTab === 3) && (
                    <div className="form-group">
                      <label htmlFor="user-select" className="form-label">
                        {activeTab === 1 ? 'Select User' : 'Select Admin'}
                      </label>
                      <select
                        id="user-select"
                        className="form-select"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        disabled={filteredUsers.length === 0 || loading}
                      >
                        <option value="">
                          {filteredUsers.length > 0 ? `Select a ${activeTab === 1 ? 'user' : 'admin'}...` : 'No users to display'}
                        </option>
                        {filteredUsers.map(u => (
                          <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      placeholder='subject'
                      className="form-control"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div className="form-check form-group">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="html-toggle"
                      checked={useHtml}
                      onChange={() => setUseHtml(!useHtml)}
                    />
                    <label className="form-check-label" htmlFor="html-toggle">Use Raw HTML Editor</label>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Message</label>
                    {useHtml ? (
                      <textarea
                        id="message"
                        className="form-control mailer-textarea"
                        rows="10"
                        value={htmlMessage}
                        onChange={(e) => setHtmlMessage(e.target.value)}
                        placeholder="Enter your HTML message here..."
                      />
                    ) : (
                      <>
                        <MarkdownToolbar />
                        <textarea
                          ref={textareaRef}
                          id="message"
                          className="form-control mailer-textarea"
                          rows="10"
                          value={message}
                          onChange={handleMessageChange}
                          onKeyDown={handleKeyDown}
                          placeholder="Enter your message here (Markdown supported)..."
                        />
                      </>
                    )}
                  </div>

                  {showPreview && !useHtml && (
                    <div className="preview-section border p-3 rounded bg-light mb-3">
                      <h6 className="mb-2">Preview</h6>
                      
                      {mediaPreview.src && (
                        <div className="media-preview mb-3 text-center">
                          {mediaPreview.type === 'image' ? (
                            <img src={mediaPreview.src} alt={mediaPreview.name} className="img-fluid rounded" style={{ maxHeight: '300px' }} />
                          ) : (
                            <video src={mediaPreview.src} controls className="img-fluid rounded" style={{ maxHeight: '300px' }}>
                              Your browser does not support the video tag.
                            </video>
                          )}
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <small className="text-muted">{mediaPreview.name}</small>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => setMediaPreview({ src: null, type: null, name: null })}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="prose">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{message}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  <button
                    className="btn-primary"
                    style={{fontSize: '2rem'}}
                    onClick={handleSendEmail}
                    disabled={loading}
                  >
                    <FaPaperPlane className="me-2" />
                    {loading ? 'Sending...' : 'Send Email'}
                  </button>
                </div>
              </div>
            </div>

            {/* Email History */}
            <div>
              <div className="mailer-card">
                <div className="mailer-card-body">
                  <h5 className="mailer-card-title">Email History</h5>
                  <p className="history-total-count">Total Sent: {totalEmails}</p>
                  <div className="history-table-wrapper">
                    <table className="table table-hover table-sm">
                      <thead>
                        <tr>
                          <th>To</th>
                          <th>Subject</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emailHistory.length > 0 ? (
                          emailHistory.map(email => (
                            <tr key={email._id}>
                              {console.log(email)}
                              <td className="table-cell-truncate" title={userMap.get(email.metadata.recipient) || email.metadata.recipient || 'N/A'}>
                                {userMap.get(email.metadata.recipient) || 'All Users'}
                              </td>
                              <td className="table-cell-truncate">{email.subject}</td>
                              <td><span className={`badge bg-${email.status === 'sent' ? 'success' : 'danger'}`}>{email.status}</span></td>
                              <td className="table-cell-nowrap">{new Date(email.sentAt || email.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="history-table-empty-cell">No email history.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {totalPages > 1 && (
                    <nav className="mt-3">
                      <ul className="pagination justify-content-end mb-0">
                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => setPage(page - 1)}>&laquo;</button>
                        </li>
                        {[...Array(totalPages).keys()].map(p => (
                          <li key={p + 1} className={`page-item ${page === p + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setPage(p + 1)}>{p + 1}</button>
                          </li>
                        ))}
                        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => setPage(page + 1)}>&raquo;</button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-4" role="alert">
          <h4 className="alert-heading">Something went wrong</h4>
          <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button 
            className="btn btn-primary mt-2" 
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap the Mailer component with ErrorBoundary
export default function MailerWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <Mailer />
    </ErrorBoundary>
  );
}