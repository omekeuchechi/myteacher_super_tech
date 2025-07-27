import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/Authcontext";
import { Editor } from '@tinymce/tinymce-react';

import Pusher from 'pusher-js';
import "../../assets/styles/admin/mediaVideo.css";
import AdminNav from '../../components/adminCom/navSection';

const API_BASE = import.meta.env.VITE_BASEURL || 'http://localhost:5000';

const initialForm = {
    lecture: "",
    videoLink: "",
    description: "",
};

const navLinks = [
    { to: "/", label: "Home" },
    { to: "/admin/ui-settings", label: "UI Settings" },
    { to: "/admin/take-lecture", label: "Take Lecture" },
    { to: "/admin/profile", label: "Profile" },
    { to: "/admin/media-video", label: "Media Video" },
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

function MediaVideo() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    // New state for lectures
    const [lectures, setLectures] = useState([]);
    const [lecturesLoading, setLecturesLoading] = useState(false);
    const [lecturesError, setLecturesError] = useState("");


    // Ref for textarea
    const descriptionRef = React.useRef(null);

    // Toolbar button style
    const toolbarBtnStyle = {
        background: '#f4f4f4',
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: 6,
        cursor: 'pointer',
        fontSize: 16,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    // Fetch all videos
    const fetchVideos = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE}/video`, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await res.json();
            if (data.success) {
                setVideos(data.videos || []);
            } else {
                setError(data.message || "Failed to fetch videos");
            }
        } catch (err) {
            setError("Network error fetching videos");
        }
        setLoading(false);
    };

    // Handle real-time updates with Pusher
    useEffect(() => {
        let pusherInstance = null;
        let channel = null;
        let isMounted = true;

        const initializePusher = () => {
            // Skip if Pusher env vars are not set
            if (!import.meta.env.VITE_PUSHER_KEY || !import.meta.env.VITE_PUSHER_CLUSTER) {
                console.warn('Pusher environment variables not configured');
                return;
            }

            try {
                // Initialize Pusher with error handling
                pusherInstance = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
                    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
                    forceTLS: true,
                    enabledTransports: ['ws', 'wss'],
                    authEndpoint: `${API_BASE}/pusher/auth`,
                    auth: {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                });

                // Subscribe to the video channel with presence for user tracking
                channel = pusherInstance.subscribe('presence-video');

                // Connection established
                channel.bind('pusher:subscription_succeeded', () => {
                    console.log('Successfully subscribed to video channel');
                });

                // Handle new video created
                channel.bind('created', (data) => {
                    if (!isMounted) return;
                    setVideos(prevVideos => {
                        // Prevent duplicates
                        if (prevVideos.some(v => v._id === data.video._id)) {
                            return prevVideos;
                        }
                        return [data.video, ...prevVideos];
                    });
                    setSuccess('A new video was added!');
                });

                // Handle video updated
                channel.bind('updated', (data) => {
                    if (!isMounted) return;
                    setVideos(prevVideos => 
                        prevVideos.map(video => 
                            video._id === data.video._id ? { ...video, ...data.video } : video
                        )
                    );
                    setSuccess('Video was updated!');
                });

                // Handle video deleted
                channel.bind('deleted', (data) => {
                    if (!isMounted) return;
                    setVideos(prevVideos => 
                        prevVideos.filter(video => video._id !== data.video._id)
                    );
                    setSuccess('Video was deleted!');
                });

                // Handle errors
                channel.bind('pusher:subscription_error', (status) => {
                    console.error('Failed to subscribe to channel:', status);
                });

                pusherInstance.connection.bind('error', (err) => {
                    console.error('Pusher connection error:', err);
                });

            } catch (error) {
                console.error('Pusher initialization error:', error);
            }
        };

        // Initial data fetch
        const fetchData = async () => {
            try {
                await fetchVideos();
                initializePusher();
            } catch (error) {
                console.error('Error initializing data:', error);
            }
        };

        fetchData();

        // Clean up on unmount
        return () => {
            isMounted = false;
            if (channel) {
                try {
                    channel.unbind_all();
                    if (pusherInstance) {
                        pusherInstance.unsubscribe('presence-video');
                    }
                } catch (error) {
                    console.error('Error cleaning up Pusher:', error);
                }
            }
        };
    }, []);

    // Fetch lectures for select dropdown
    useEffect(() => {
        const fetchLectures = async () => {
            setLecturesLoading(true);
            setLecturesError("");
            try {
                const res = await fetch(`${API_BASE}/lecture/lectures`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    const now = new Date();
                    setLectures(
                        (data.lectures || []).filter(
                            (lecture) => !lecture.expiringDate || new Date(lecture.expiringDate) > now
                        )
                    );
                } else {
                    setLecturesError(data.message || "Failed to fetch lectures");
                }
            } catch (err) {
                setLecturesError("Network error fetching lectures");
            }
            setLecturesLoading(false);
        };
        fetchLectures();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle lecture select change
    const handleLectureChange = (e) => {
        setForm({ ...form, lecture: e.target.value });
    };

    // Create or update a video
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const method = editId ? "PATCH" : "POST";
            const url = editId ? `${API_BASE}/video/${editId}` : `${API_BASE}/video/create`;
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(editId ? "Video updated!" : "Video created!");
                setForm(initialForm);
                setEditId(null);
                fetchVideos();
            } else {
                setError(data.message || "Failed to save video");
            }
        } catch (err) {
            setError("Network error saving video");
        }
        setLoading(false);
    };

    // Edit a video
    const handleEdit = (video) => {
        setForm({
            lecture: video.lecture?._id || video.lecture || "",
            videoLink: video.videoLink || "",
            description: video.description || "",
        });
        setEditId(video._id);
        setSuccess("");
        setError("");
    };

    // Delete a video
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this video?")) return;
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await fetch(`${API_BASE}/video/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await res.json();
            if (data.success) {
                setSuccess("Video deleted!");
                fetchVideos();
            } else {
                setError(data.message || "Failed to delete video");
            }
        } catch (err) {
            setError("Network error deleting video");
        }
        setLoading(false);
    };

    // Cancel editing
    const handleCancel = () => {
        setEditId(null);
        setForm(initialForm);
        setError("");
        setSuccess("");
    };

    return (
        <>
        <AdminNav navLinks={navLinks} onLogout={logout}/>
        <div className="media-video-container">
            <div className="media-video-header">
                <h2>Manage Videos</h2>
            </div>
            <form className="media-video-form" onSubmit={handleSubmit}>
                <select
                    name="lecture"
                    value={form.lecture}
                    onChange={handleLectureChange}
                    required
                    disabled={lecturesLoading}
                >
                    <option value="">{lecturesLoading ? "Loading lectures..." : "Select a Lecture"}</option>
                    {lectures.map((lecture) => (
                        <option key={lecture._id} value={lecture._id}>
                            {lecture.name || lecture.title || lecture.topic || lecture._id}
                        </option>
                    ))}
                </select>
                {lecturesError && (
                    <div style={{ color: "#e74c3c", marginTop: 4 }}>{lecturesError}</div>
                )}
                <input
                    type="text"
                    name="videoLink"
                    placeholder="Video Link (YouTube, Vimeo, etc.)"
                    value={form.videoLink}
                    onChange={handleChange}
                    required
                />
                <div style={{ marginBottom: '16px' }}>
                    <Editor
                        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                        value={form.description}
                        init={{
                            height: 400,
                            menubar: true,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family: Arial, sans-serif; font-size: 14px; }',
                            branding: false,
                            // Enable TinyMCE cloud channel (optional, but recommended)
                            // This ensures you get the latest stable version
                            // Remove or modify this if you want a specific version
                            // cloud_channel: '6',
                            // Optional: Configure image upload
                            // images_upload_url: 'your_image_upload_endpoint',
                            // images_upload_credentials: true
                        }}
                        onEditorChange={(content) => {
                            setForm(prev => ({
                                ...prev,
                                description: content
                            }));
                        }}
                    />
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                    <button type="submit" disabled={loading}>
                        {editId ? "Update Video" : "Add Video"}
                    </button>
                    {editId && (
                        <button type="button" onClick={handleCancel} style={{ background: "#888", color: "#fff" }}>
                            Cancel
                        </button>
                    )}
                </div>
                {error && <div style={{ color: "#e74c3c", marginTop: 8 }}>{error}</div>}
                {success && <div style={{ color: "#27ae60", marginTop: 8 }}>{success}</div>}
            </form>
            <div className="media-video-list">
                {loading ? (
                    <div>Loading...</div>
                ) : videos.length === 0 ? (
                    <div className="media-video-no-data">No videos found.</div>
                ) : (
                    videos.map((video) => (
                        <div key={video._id} className="media-video-item">
                            <div className="media-video-details">
                                <div className="media-video-title">
                                    {typeof video.lecture === "object"
                                        ? video.lecture.title || video.lecture.name || video.lecture._id || "Untitled Lecture"
                                        : video.lecture || "Untitled Lecture"}
                                </div>
                                <div 
                                    className="media-video-desc" 
                                    dangerouslySetInnerHTML={{ 
                                        __html: video.description && video.description.length > 150 
                                            ? `${video.description.substring(0, 150)}...` 
                                            : video.description || ''
                                    }} 
                                />
                                <div className="media-video-link">
                                    <a
                                        href={video.videoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-block',
                                            color: '#2563eb',
                                            background: '#f0f6ff',
                                            padding: '6px 14px',
                                            borderRadius: 6,
                                            fontWeight: 500,
                                            textDecoration: 'none',
                                            transition: 'background 0.2s, color 0.2s',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                            marginTop: 4,
                                            marginBottom: 2,
                                        }}
                                        onMouseOver={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseOut={e => { e.currentTarget.style.background = '#f0f6ff'; e.currentTarget.style.color = '#2563eb'; }}
                                    >
                                        {video.videoLink}
                                    </a>
                                </div>
                            </div>
                            <div className="media-video-actions">
                                <button className="edit" onClick={() => handleEdit(video)} disabled={loading}>
                                    Edit
                                </button>
                                <button className="delete" onClick={() => handleDelete(video._id)} disabled={loading}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
        </>
    );
}

export default MediaVideo;
