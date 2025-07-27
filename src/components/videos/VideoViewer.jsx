import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import './VideoViewer.css';

const API_BASE = import.meta.env.VITE_BASEURL || 'http://localhost:5000';

const VideoViewer = ({ video, onVideoUpdate }) => {
    const [commentInput, setCommentInput] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleAddComment = async (e) => {
        e.preventDefault();
        const text = commentInput.trim();
        if (!text || !video?._id) return;
        
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE}/video/${video._id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ text }),
            });
            
            const data = await response.json();
            if (data.success && onVideoUpdate) {
                onVideoUpdate(data.video);
                setCommentInput('');
                setEditingComment(null);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment);
        setCommentInput(comment.text);
    };

    const handleUpdateComment = async (e) => {
        e.preventDefault();
        if (!editingComment) return;
        
        try {
            const response = await fetch(`${API_BASE}/video/${video._id}/comment/${editingComment._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ text: commentInput }),
            });
            
            const data = await response.json();
            if (data.success && onVideoUpdate) {
                onVideoUpdate(data.video);
                setCommentInput('');
                setEditingComment(null);
            }
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    if (!video) return null;

    const isYouTube = video.videoLink?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);

    return (
        <div className="video-container">
            {!video.videoLink ? (
                <div>Video not available</div>
            ) : isYouTube ? (
                <div className="video-embed">
                    <iframe
                        src={`https://www.youtube.com/embed/${isYouTube[1]}`}
                        title="Video player"
                        allowFullScreen
                    />
                </div>
            ) : (
                <video controls className="video-player">
                    <source src={video.videoLink} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}

            <div className="video-description">
                <h3>{video.lecture?.name || 'Video'}</h3>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {video.description || 'No description available.'}
                </ReactMarkdown>
            </div>

            <div className="comments">
                <h4>Comments ({video.comments?.length || 0})</h4>
                
                <form onSubmit={editingComment ? handleUpdateComment : handleAddComment} className="comment-form">
                    <textarea
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder={editingComment ? "Edit comment..." : "Add a comment..."}
                        disabled={isLoading}
                        rows="3"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            border: '1px solid #d1d5db',
                            fontFamily: 'inherit',
                            fontSize: '0.95rem',
                            resize: 'vertical',
                            minHeight: '80px',
                            marginBottom: '0.5rem'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                            type="submit" 
                            disabled={!commentInput.trim() || isLoading}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                opacity: (!commentInput.trim() || isLoading) ? 0.6 : 1
                            }}
                        >
                            {isLoading ? '...' : (editingComment ? 'Update' : 'Post')}
                        </button>
                    {editingComment && (
                        <button 
                            type="button" 
                            onClick={() => setEditingComment(null)}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                    )}
                    </div>
                </form>

                {video.comments?.length > 0 ? (
                    <div className="comment-list">
                        {video.comments.map(comment => (
                            <div key={comment._id} className="comment">
                                <div className="comment-header">
                                    <span className="comment-author">
                                        {comment.user?.name || 'Anonymous'}
                                    </span>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleString()}
                                        {comment.edited && ' (edited)'}
                                    </span>
                                </div>
                                <div className="comment-text">{comment.text}</div>
                                {comment.user?._id === localStorage.getItem("userId") && (
                                    <button 
                                        onClick={() => handleEditComment(comment)}
                                        className="edit-btn"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};

export default VideoViewer;