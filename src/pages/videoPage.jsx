import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Pusher from 'pusher-js';
import { FiSun, FiMoon, FiWifi, FiWifiOff, FiClock, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { offlineDB, syncPendingReplies } from '../utils/offlineDB';
import "../assets/styles/dashboard/videoPage.css";
import VideoViewer from "../components/videos/VideoViewer";
import { Link } from "react-router-dom";

import myteacherLogo from "../img/Untitled-1.png";

// Dark mode hook
const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check system preference
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Set initial theme
        const updateTheme = (isDark) => {
            setIsDarkMode(isDark);
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        };

        // Check for saved user preference
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) {
            updateTheme(savedMode === 'true');
        } else {
            updateTheme(darkModeMediaQuery.matches);
        }

        // Listen for system preference changes
        const handleChange = (e) => {
            if (localStorage.getItem('darkMode') === null) {
                updateTheme(e.matches);
            }
        };

        darkModeMediaQuery.addEventListener('change', handleChange);
        return () => darkModeMediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
        localStorage.setItem('darkMode', newMode);
    };

    return { isDarkMode, toggleDarkMode };
};

const API_BASE = import.meta.env.VITE_BASEURL || 'http://localhost:5000';

// Initialize Pusher
const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    forceTLS: true
});

function getToken() {
    return localStorage.getItem("token");
}

function VideoPage() {
    // State management
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [commentInputs, setCommentInputs] = useState({});
    const [replyInputs, setReplyInputs] = useState({});
    const [editingComment, setEditingComment] = useState(null);
    const [editingReply, setEditingReply] = useState(null);
    const [users, setUsers] = useState({});
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [commentsToShow, setCommentsToShow] = useState({});
    const [replyingTo, setReplyingTo] = useState(null); // Track which comment is being replied to
    const [showEditPopup, setShowEditPopup] = useState(null); // Track edit popup state
    
    // Dark mode state and toggle function
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    
    // Refs and constants
    const commentRefs = useRef({});
    const replyRefs = useRef({});
    const COMMENTS_PER_PAGE = 30;

    // Create a map of lecture IDs to lecture objects for quick lookup
    const lectureMap = useMemo(() => {
        const map = new Map();
        videos.forEach(video => {
            if (video.lecture && typeof video.lecture === 'object' && video.lecture._id) {
                map.set(video.lecture._id, video.lecture);
            }
        });
        return map;
    }, [videos]);

    // Fetch user data for all unique user IDs in comments and replies
    useEffect(() => {
        const fetchUserData = async () => {
            if (!videos.length) return;

            // Get all unique user IDs from comments and replies
            const userIds = new Set();
            videos.forEach(video => {
                // Get user IDs from comments
                if (Array.isArray(video.comment)) {
                    video.comment.forEach(comment => {
                        const userId = typeof comment.user === 'string' ? comment.user : comment.user?._id;
                        if (userId && !users[userId]) {
                            userIds.add(userId);
                        }
                    });
                }
                // Get user IDs from replies
                if (Array.isArray(video.replyComment)) {
                    video.replyComment.forEach(reply => {
                        const userId = typeof reply.user === 'string' ? reply.user : reply.user?._id;
                        if (userId && !users[userId]) {
                            userIds.add(userId);
                        }
                    });
                }
            });

            // Only fetch if we have new user IDs to look up
            if (userIds.size === 0) return;

            try {
                // Fetch all users in a single request if your API supports it
                const res = await fetch(`${API_BASE}/video/users?ids=${Array.from(userIds).join(',')}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                const data = await res.json();

                if (data.success && Array.isArray(data.users)) {
                    const newUsers = {};
                    data.users.forEach(user => {
                        if (user?._id) {
                            newUsers[user._id] = user;
                        }
                    });
                    setUsers(prev => ({ ...prev, ...newUsers }));
                }
            } catch (err) {
                console.error('Error fetching users:', err);

                // Fallback: If batch endpoint fails, try fetching users one by one
                const userPromises = Array.from(userIds).map(async (userId) => {
                    try {
                        const res = await fetch(`${API_BASE}/video/user/${userId}`, {
                            headers: { Authorization: `Bearer ${getToken()}` },
                        });
                        const data = await res.json();
                        if (data.success && data.user) {
                            return { [userId]: data.user };
                        }
                    } catch (err) {
                        console.error(`Error fetching user ${userId}:`, err);
                    }
                    return {};
                });

                Promise.all(userPromises).then(userDataArray => {
                    const usersData = userDataArray.reduce((acc, userObj) => ({
                        ...acc,
                        ...userObj
                    }), {});
                    setUsers(prev => ({ ...prev, ...usersData }));
                });
            }
        };

        fetchUserData();
    }, [videos, users]);

    // Helper function to get lecture name
    const getLectureName = (lecture) => {
        if (!lecture) return 'Untitled Lecture';

        // If lecture is an object with properties
        if (typeof lecture === 'object' && lecture !== null) {
            return lecture.name || lecture.title || lecture.topic || lecture._id || 'Untitled Lecture';
        }

        // If lecture is just an ID string, try to look it up in the map
        if (typeof lecture === 'string' && lecture.length === 24) {
            const foundLecture = lectureMap.get(lecture);
            return foundLecture
                ? (foundLecture.name || foundLecture.title || foundLecture.topic || 'Unknown Lecture')
                : 'Unknown Lecture';
        }

        return 'Untitled Lecture';
    };

    // Fetch all videos
    useEffect(() => {
        async function fetchVideos() {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(`${API_BASE}/video`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                const data = await res.json();
                if (data.success) {
                    // Sort comments in descending order by createdAt date (newest first)
                    const sortedVideos = (data.videos || []).map(video => ({
                        ...video,
                        comment: Array.isArray(video.comment) 
                            ? [...video.comment].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            : []
                    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort videos by date (newest first)
                    setVideos(sortedVideos);
                } else {
                    setError(data.message || "Failed to fetch videos");
                }
            } catch (err) {
                setError("Network error fetching videos");
            }
            setLoading(false);
        }
        fetchVideos();

        // Subscribe to Pusher channel for real-time updates
        const channel = pusher.subscribe('video');

        // Handle new comments
        channel.bind('comment_created', (data) => {
            setVideos(prevVideos =>
                prevVideos.map(video =>
                    video._id === data.videoId
                        ? { ...video, comment: [...(video.comment || []), data.comment] }
                        : video
                )
            );
        });

        // Handle comment updates
        channel.bind('comment_edited', (data) => {
            setVideos(prevVideos =>
                prevVideos.map(video =>
                    video._id === data.videoId
                        ? {
                            ...video,
                            comment: video.comment.map(comment =>
                                comment._id === data.comment._id ? data.comment : comment
                            )
                        }
                        : video
                )
            );
        });

        // Handle new replies
        channel.bind('reply_created', (data) => {
            setVideos(prevVideos =>
                prevVideos.map(video =>
                    video._id === data.videoId
                        ? {
                            ...video,
                            replyComment: [...(video.replyComment || []), data.reply]
                        }
                        : video
                )
            );
        });

        // Handle reply updates
        channel.bind('reply_edited', (data) => {
            setVideos(prevVideos =>
                prevVideos.map(video =>
                    video._id === data.videoId
                        ? {
                            ...video,
                            replyComment: video.replyComment.map(reply =>
                                reply._id === data.reply._id ? data.reply : reply
                            )
                        }
                        : video
                )
            );
        });

        // Handle video updates
        channel.bind('updated', (data) => {
            setVideos(prevVideos =>
                prevVideos.map(video => {
                    if (video._id === data.video._id) {
                        // If this is the currently selected video, update it
                        if (selectedVideo?._id === data.video._id) {
                            setSelectedVideo(data.video);
                        }
                        return data.video;
                    }
                    return video;
                })
            );
        });

        // Handle video deletion
        channel.bind('deleted', (data) => {
            setVideos(prevVideos =>
                prevVideos.filter(video => video._id !== data.video._id)
            );
            // If the deleted video is currently selected, close the viewer
            if (selectedVideo?._id === data.video._id) {
                setSelectedVideo(null);
            }
        });

        // Clean up subscription on unmount
        return () => {
            channel.unbind_all();
            pusher.unsubscribe('video');
        };
    }, []);

    // Handle comment input change
    const handleCommentInput = (videoId, value) => {
        setCommentInputs((prev) => ({ ...prev, [videoId]: value }));
    };

    // Handle reply input change
    const handleReplyInput = (commentId, value) => {
        setReplyInputs((prev) => ({ ...prev, [commentId]: value }));
    };

    // Add comment
    const handleAddComment = async (videoId) => {
        const text = commentInputs[videoId]?.trim();
        if (!text) return;
        try {
            const res = await fetch(`${API_BASE}/video/${videoId}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ text }),
            });
            const data = await res.json();
            if (data.success) {
                setVideos((prev) => prev.map((v) => (v._id === videoId ? data.video : v)));
                setCommentInputs((prev) => ({ ...prev, [videoId]: "" }));
            } else {
                alert(data.message || "Failed to add comment");
            }
        } catch (err) {
            alert("Network error adding comment");
        }
    };

    // State for tracking offline replies
    const [offlineReplies, setOfflineReplies] = useState({});
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Check online status
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            // Try to sync any pending replies when coming back online
            syncPendingReplies(syncReplyWithServer);
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Load pending replies from IndexedDB on mount
    useEffect(() => {
        const loadPendingReplies = async () => {
            try {
                const replies = await offlineDB.getAllPendingReplies();
                const repliesByComment = {};
                replies.forEach(reply => {
                    if (!repliesByComment[reply.commentId]) {
                        repliesByComment[reply.commentId] = [];
                    }
                    repliesByComment[reply.commentId].push(reply);
                });
                setOfflineReplies(repliesByComment);
            } catch (error) {
                console.error('Error loading pending replies:', error);
            }
        };

        loadPendingReplies();
    }, []);

    // Function to sync a single reply with the server
    const syncReplyWithServer = async (pendingReply) => {
        try {
            const { videoId, commentId, text } = pendingReply;
            const response = await fetch(`${API_BASE}/video/${videoId}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ 
                    commentId, 
                    text,
                    userId: localStorage.getItem("userId")
                }),
            });

            const data = await response.json();
            if (data.success) {
                // Update the UI with the synced reply
                setVideos(prev => prev.map(v => v._id === videoId ? data.video : v));
                // Remove from offline storage
                await offlineDB.deleteReply(pendingReply.id);
                // Update local state
                setOfflineReplies(prev => ({
                    ...prev,
                    [commentId]: (prev[commentId] || []).filter(r => r.id !== pendingReply.id)
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error syncing reply:', error);
            return false;
        }
    };

    // Add reply with offline support
    const handleAddReply = async (videoId, commentId) => {
        const text = replyInputs[commentId]?.trim();
        if (!text) return;

        const replyData = {
            videoId,
            commentId,
            text,
            status: 'sending'
        };

        try {
            if (!isOnline) {
                // Save to IndexedDB for offline
                const id = await offlineDB.addReply(replyData);
                // Update local state to show pending reply
                setOfflineReplies(prev => ({
                    ...prev,
                    [commentId]: [...(prev[commentId] || []), { ...replyData, id, status: 'pending' }]
                }));
                // Clear the input
                setReplyInputs(prev => ({ ...prev, [commentId]: "" }));
                setReplyingTo(null);
                return;
            }

            // If online, try to send immediately
            replyData.status = 'sending';
            const tempId = Date.now(); // Temp ID for UI
            setOfflineReplies(prev => ({
                ...prev,
                [commentId]: [...(prev[commentId] || []), { ...replyData, id: tempId, status: 'sending' }]
            }));

            const response = await fetch(`${API_BASE}/video/${videoId}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ 
                    commentId, 
                    text,
                    userId: localStorage.getItem("userId")
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                // Update the UI with the server response
                setVideos(prev => prev.map(v => v._id === videoId ? data.video : v));
                // Remove from local state
                setOfflineReplies(prev => ({
                    ...prev,
                    [commentId]: (prev[commentId] || []).filter(r => r.id !== tempId)
                }));
                // Clear the input
                setReplyInputs(prev => ({ ...prev, [commentId]: "" }));
                setReplyingTo(null);
            } else {
                // If server error, save to offline storage
                const id = await offlineDB.addReply(replyData);
                setOfflineReplies(prev => ({
                    ...prev,
                    [commentId]: (prev[commentId] || []).map(r => 
                        r.id === tempId ? { ...r, id, status: 'error', error: data.message || 'Failed to send' } : r
                    )
                }));
                alert(data.message || "Failed to send reply. It will be sent when you're back online.");
            }
        } catch (err) {
            console.error('Error adding reply:', err);
            // Save to offline storage
            const id = await offlineDB.addReply(replyData);
            setOfflineReplies(prev => ({
                ...prev,
                [commentId]: (prev[commentId] || []).map(r => 
                    r.id === tempId ? { ...r, id, status: 'error', error: 'Network error' } : r
                )
            }));
            alert("You're offline. Your reply will be sent when you're back online.");
        }
    };

    // Handle comment double click
    const handleCommentDoubleClick = (videoId, comment) => {
        // Only allow editing own comments that haven't been edited
        const userId = localStorage.getItem('userId');
        if (comment.user.toString() === userId && !comment.edited) {
            setShowEditPopup({
                videoId,
                commentId: comment._id,
                text: comment.text
            });
        }
    };

    // Edit comment
    const handleEditComment = (videoId, comment) => {
        setEditingComment({ videoId, commentId: comment._id, text: comment.text });
        setTimeout(() => {
            if (commentRefs.current[comment._id]) commentRefs.current[comment._id].focus();
        }, 0);
    };

    const handleSaveEditComment = async () => {
        const { videoId, commentId, text } = editingComment;
        if (!text.trim()) return;
        try {
            const res = await fetch(`${API_BASE}/video/${videoId}/comment/${commentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ text }),
            });
            const data = await res.json();
            if (data.success) {
                setVideos((prev) => prev.map((v) => (v._id === videoId ? data.video : v)));
                setEditingComment(null);
            } else {
                alert(data.message || "Failed to edit comment");
            }
        } catch (err) {
            alert("Network error editing comment");
        }
    };

    // Edit reply
    const handleEditReply = (videoId, reply) => {
        setEditingReply({ videoId, replyId: reply._id, text: reply.text });
        setTimeout(() => {
            if (replyRefs.current[reply._id]) replyRefs.current[reply._id].focus();
        }, 0);
    };

    const handleSaveEditReply = async () => {
        const { videoId, replyId, text } = editingReply;
        if (!text.trim()) return;
        try {
            const res = await fetch(`${API_BASE}/video/${videoId}/reply/${replyId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ text }),
            });
            const data = await res.json();
            if (data.success) {
                setVideos((prev) => prev.map((v) => (v._id === videoId ? data.video : v)));
                setEditingReply(null);
            } else {
                alert(data.message || "Failed to edit reply");
            }
        } catch (err) {
            alert("Network error editing reply");
        }
    };

    const handleVideoUpdate = (updatedVideo) => {
        setVideos(prevVideos =>
            prevVideos.map(v =>
                v._id === updatedVideo._id ? updatedVideo : v
            )
        );
    };

    // Render
    return (
        <div className="user-video-body">
        <div className="user-video-page">
            <div className="user-video-nav">
                <Link to="/" className="user-video-nav-logo"><img src={myteacherLogo} alt="Myteacher home image" /></Link>
                <Link to="/dashboard" className="user-video-nav-link">Dashboard</Link>
            </div>
                <button 
                onClick={toggleDarkMode} 
                className="theme-toggle"
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    color: 'var(--text-primary)',
                    zIndex: 1000,
                    padding: '10px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                }}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>
            <h2>All Videos</h2>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div style={{ color: '#e74c3c' }}>{error}</div>
            ) : videos.length === 0 ? (
                <div>No videos found.</div>
            ) : (
                videos.map((video) => (
                    <div
                        key={video._id}
                        className="user-video-card"
                    >
                        <div className="video-content">
                            <div className="video-title">
                                {getLectureName(video.lecture)}
                            </div>
                            <div className="video-description">
                                <div 
                                    className="video-description" 
                                    dangerouslySetInnerHTML={{ 
                                        __html: video.description && video.description.length > 150
                                            ? `${video.description.substring(0, 150)}...`
                                            : video.description || ''
                                    }} 
                                />
                            </div>
                            <div className="video-preview">
                                <VideoViewer
                                    video={video}
                                    onVideoUpdate={handleVideoUpdate}
                                />
                            </div>
                        </div>
                        <div className="comments-section">
                            <div className="comments-title">Comments</div>
                                {Array.isArray(video.comment) && video.comment.length > 0 ? (
                                [...video.comment]
                                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                                    .slice(0, commentsToShow[video._id] || 30)
                                    .map((comment) => {
                                    const userId = typeof comment.user === 'string' ? comment.user : comment.user?._id;
                                    const user = users[userId] || {};
                                    const displayName = user.name || user.email || userId || 'User';
                                    return (
                                        <div 
                                            key={comment._id} 
                                            className="comment"
                                            onDoubleClick={() => handleCommentDoubleClick(video._id, comment)}
                                            style={{ 
                                                cursor: comment.user && comment.user.toString && localStorage.getItem('userId') === comment.user.toString() && !comment.edited ? 'pointer' : 'default'
                                            }}
                                        >
                                            <div className="comment-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {user.avatar ? (
                                                    <img 
                                                        src={user.avatar} 
                                                        alt={displayName} 
                                                        style={{ 
                                                            width: '32px', 
                                                            height: '32px', 
                                                            borderRadius: '50%',
                                                            objectFit: 'cover'
                                                        }} 
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#e0e0e0',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#666',
                                                        fontWeight: 'bold',
                                                        fontSize: '14px'
                                                    }}>
                                                        {displayName.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="user-info" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                                                    <span style={{ fontWeight: '600' }}>{user.name || displayName}</span>
                                                    {user.name && user.name !== displayName && (
                                                        <span style={{ fontSize: '0.8em', color: '#666' }}>@{displayName}</span>
                                                    )}
                                                </div>
                                            </div>
                                            {editingComment && editingComment.commentId === comment._id ? (
                                                <div className="comment-form">
                                                    <textarea
                                                        ref={el => commentRefs.current[comment._id] = el}
                                                        value={editingComment.text}
                                                        onChange={e => setEditingComment(ec => ({ ...ec, text: e.target.value }))}
                                                        className="comment-input"
                                                        rows="3"
                                                        style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
                                                    />
                                                    <button onClick={handleSaveEditComment} className="btn btn-primary">Save</button>
                                                    <button onClick={() => setEditingComment(null)} className="btn btn-outline">Cancel</button>
                                                </div>
                                            ) : (
                                                <div className="comment-text">{comment.text}</div>
                                            )}
                                            <div className="comment-meta">
                                                {comment.createdAt && (new Date(comment.createdAt)).toLocaleString()} {comment.edited ? '(edited)' : ''}
                                            </div>
                                            <div className="comment-actions">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    {comment.user && comment.user.toString && getToken() && (!comment.edited) && (localStorage.getItem('userId') === comment.user.toString()) && !editingComment && (
                                                        <button
                                                            onClick={() => handleEditComment(video._id, comment)}
                                                            className="btn btn-link btn-sm"
                                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                                            title="Edit comment"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                            <span>Edit</span>
                                                        </button>
                                                    )}
                                                    <button 
                                                        className="btn btn-link btn-sm"
                                                        onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                                    >
                                                        <i className="fas fa-reply"></i>
                                                        <span>Reply</span>
                                                    </button>
                                                    {!isOnline && (
                                                        <span className="online-status offline" title="You're offline. Replies will be sent when you're back online.">
                                                            <FiWifiOff /> Offline
                                                        </span>
                                                    )}
                                                    {isOnline && (
                                                        <span className="online-status online" title="You're online">
                                                            <FiWifi /> Online
                                                        </span>
                                                    )}
                                                </div>
                                                {replyingTo === comment._id && (
                                                    <div className="reply-input-container" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '0.5rem' }}>
                                                        <textarea
                                                            placeholder="Write a reply..."
                                                            className="comment-input"
                                                            style={{ 
                                                                width: '100%', 
                                                                padding: '1rem', 
                                                                border: '1px solid #d1d5db', 
                                                                borderRadius: '0.375rem', 
                                                                fontSize: '1.5rem', 
                                                                transition: 'border-color 0.2s ease, box-shadow 0.2s ease', 
                                                                outline: 'none',
                                                                minHeight: '80px',
                                                                resize: 'vertical'
                                                            }}
                                                            value={replyInputs[comment._id] || ''}
                                                            onChange={e => handleReplyInput(comment._id, e.target.value)}
                                                            rows="3"
                                                        />
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => {
                                                                handleAddReply(video._id, comment._id);
                                                                setReplyingTo(null);
                                                            }}
                                                        >
                                                            <i className="fa-sharp fa-solid fa-paper-plane"></i>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Pending replies UI */}
                                            <div className="pending-replies">
                                                {offlineReplies[comment._id]?.map(reply => (
                                                    <div key={reply.id} className={`pending-reply ${reply.status}`}>
                                                        <div className="pending-reply-text">{reply.text}</div>
                                                        <div className="pending-reply-status">
                                                            {reply.status === 'sending' && (
                                                                <span className="sending"><FiClock /> Sending...</span>
                                                            )}
                                                            {reply.status === 'pending' && (
                                                                <span className="pending"><FiClock /> Waiting for connection...</span>
                                                            )}
                                                            {reply.status === 'error' && (
                                                                <span className="error"><FiAlertCircle /> {reply.error || 'Failed to send'}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="reply-section">
                                                {Array.isArray(video.replyComment) && [
                                                    ...video.replyComment,
                                                    ...(offlineReplies[comment._id]?.filter(r => r.status === 'sent') || [])
                                                ].filter(r => r.commentId === comment._id).length > 0 && (
                                                    <div className="replies-list">
                                                        {video.replyComment
                                                            .filter(r => r.commentId === comment._id)
                                                            .map(reply => {
                                                                const replyUserId = typeof reply.user === 'string' ? reply.user : reply.user?._id;
                                                                const replyUser = users[replyUserId] || {};
                                                                const replyDisplayName = replyUser.name || replyUser.email || replyUserId || 'User';
                                                                return (
                                                                    <div key={reply._id} className="reply">
                                                                        <div className="comment-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                            {replyUser.avatar ? (
                                                                                <img 
                                                                                    src={replyUser.avatar} 
                                                                                    alt={replyDisplayName} 
                                                                                    style={{ 
                                                                                        width: '28px', 
                                                                                        height: '28px', 
                                                                                        borderRadius: '50%',
                                                                                        objectFit: 'cover'
                                                                                    }} 
                                                                                />
                                                                            ) : (
                                                                                <div style={{
                                                                                    width: '28px',
                                                                                    height: '28px',
                                                                                    borderRadius: '50%',
                                                                                    backgroundColor: '#e0e0e0',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    color: '#666',
                                                                                    fontWeight: 'bold',
                                                                                    fontSize: '12px'
                                                                                }}>
                                                                                    {replyDisplayName.charAt(0).toUpperCase()}
                                                                                </div>
                                                                            )}
                                                                            <div className="user-info" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                                                                                <span style={{ fontWeight: '600' }}>{replyUser.name || replyDisplayName}</span>
                                                                                {replyUser.name && replyUser.name !== replyDisplayName && (
                                                                                    <span style={{ fontSize: '0.75em', color: '#666' }}>@{replyDisplayName}</span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        {editingReply && editingReply.replyId === reply._id ? (
                                                                            <div className="comment-form" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                                                <textarea
                                                                                    ref={el => replyRefs.current[reply._id] = el}
                                                                                    value={editingReply.text}
                                                                                    onChange={e => setEditingReply(er => ({ ...er, text: e.target.value }))}
                                                                                    className="comment-input"
                                                                                    rows="3"
                                                                                    style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
                                                                                />
                                                                                <button onClick={handleSaveEditReply} className="btn btn-primary">Save</button>
                                                                                <button onClick={() => setEditingReply(null)} className="btn btn-outline">Cancel</button>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="comment-text">{reply.text}</div>
                                                                        )}
                                                                        <div className="comment-meta">
                                                                            {reply.createdAt && (new Date(reply.createdAt)).toLocaleString()} {reply.edited ? '(edited)' : ''}
                                                                        </div>
                                                                        {reply.user && reply.user.toString && getToken() && (!reply.edited) && (localStorage.getItem('userId') === reply.user.toString()) && !editingReply && (
                                                                            <button
                                                                                onClick={() => handleEditReply(video._id, reply)}
                                                                                className="btn btn-link btn-sm"
                                                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                                                                title="Edit reply"
                                                                            >
                                                                                <i className="fas fa-edit"></i>
                                                                                <span>Edit</span>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-comments">No comments yet.</div>
                            )}
                            {Array.isArray(video.comment) && video.comment.length > (commentsToShow[video._id] || COMMENTS_PER_PAGE) && (
                                <button 
                                    className="load-more-comments"
                                    onClick={() => setCommentsToShow(prev => ({
                                        ...prev,
                                        [video._id]: (prev[video._id] || COMMENTS_PER_PAGE) + COMMENTS_PER_PAGE
                                    }))}
                                >
                                    Load More Comments
                                </button>
                            )}
                            <div className="comment-form">
                                <textarea
                                    className="comment-input"
                                    placeholder="Add a comment..."
                                    value={commentInputs[video._id] || ''}
                                    onChange={e => handleCommentInput(video._id, e.target.value)}
                                    rows="3"
                                    style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleAddComment(video._id)}
                                >
                                    <i className="fa-sharp fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
            
            {/* Edit Confirmation Popup */}
            {showEditPopup && (
                <div className="edit-popup-overlay" onClick={() => setShowEditPopup(null)}>
                    <div className="edit-popup" onClick={e => e.stopPropagation()}>
                        <h3>Edit Comment</h3>
                        <p>Do you want to edit this comment?</p>
                        <div className="popup-buttons">
                            <button 
                                onClick={() => {
                                    handleEditComment(showEditPopup.videoId, {
                                        _id: showEditPopup.commentId,
                                        text: showEditPopup.text
                                    });
                                    setShowEditPopup(null);
                                }} 
                                className="btn btn-primary"
                            >
                                Yes, Edit
                            </button>
                            <button 
                                onClick={() => setShowEditPopup(null)} 
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}

export default VideoPage;