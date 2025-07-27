import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/Authcontext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/techblog.css';
import Pusher from 'pusher-js';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000";

const TechBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const limit = 10;

  // Fetch posts with pagination
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE}/posts?page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } else {
        throw new Error(data.message || 'Failed to fetch posts');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  // Initialize Pusher
  const initializePusher = useCallback(() => {
    if (!import.meta.env.VITE_PUSHER_KEY) {
      console.warn('Pusher key not found. Real-time updates disabled.');
      return () => {};
    }

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'mt1',
      forceTLS: true,
      authEndpoint: `${API_BASE}/pusher/auth`,
      auth: {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    });

    const channel = pusher.subscribe('posts');
    
    // Handle new post
    channel.bind('new-post', (data) => {
      setPosts(prevPosts => [data.post, ...prevPosts.slice(0, limit - 1)]);
      toast.info('New post available!');
    });

    // Handle post update
    channel.bind('post-updated', (data) => {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === data.post._id ? data.post : post
        )
      );
      if (selectedPost?._id === data.post._id) {
        setSelectedPost(data.post);
      }
    });

    // Handle post deletion
    channel.bind('post-deleted', (data) => {
      setPosts(prevPosts => 
        prevPosts.filter(post => post._id !== data.postId)
      );
      if (selectedPost?._id === data.postId) {
        setShowModal(false);
      }
      toast.info('A post was deleted');
    });

    // Handle like updates
    channel.bind('like-updated', (data) => {
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === data.postId) {
            return {
              ...post,
              likes: data.likes
            };
          }
          return post;
        })
      );

      if (selectedPost?._id === data.postId) {
        setSelectedPost(prev => ({
          ...prev,
          likes: data.likes
        }));
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [selectedPost, limit]);

  // Initialize Pusher when component mounts
  useEffect(() => {
    const cleanup = initializePusher();
    return () => {
      cleanup?.();
    };
  }, [initializePusher]);

  // Fetch posts when page changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, page]);

  // Handle like action
  const handleLike = async (postId) => {
    if (!user) {
      toast.info('Please login to like posts');
      return;
    }

    setIsLiking(true);
    try {
      const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to like post');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle comment submission
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !selectedPost) return;

    try {
      const response = await fetch(`${API_BASE}/posts/${selectedPost._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: comment })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add comment');
      }
      
      setComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="tech-blog-container">
      <header className="blog-header">
        <h1>Tech Blog</h1>
        {user?.isAdmin && (
          <button 
            className="create-post-btn"
            onClick={() => navigate('/create-post')}
          >
            Create New Post
          </button>
        )}
      </header>

      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            {post.images?.[0]?.url && (
              <img 
                src={post.images[0].url} 
                alt={post.title} 
                className="post-image"
                onClick={() => {
                  setSelectedPost(post);
                  setShowModal(true);
                }}
              />
            )}
            <div className="post-content">
              <h3>{post.title}</h3>
              <p className="post-meta">
                By {post.createdBy?.username || 'Admin'} • {formatDate(post.createdAt)}
              </p>
              <p className="post-excerpt">
                {post.content.substring(0, 150)}...
              </p>
              <div className="post-actions">
                <button 
                  className={`like-btn ${post.likes?.some(like => like.user === user?.userId) ? 'liked' : ''}`}
                  onClick={() => handleLike(post._id)}
                  disabled={isLiking}
                >
                  <i className="fas fa-heart"></i> {post.likes?.length || 0}
                </button>
                <button 
                  className="comment-btn"
                  onClick={() => {
                    setSelectedPost(post);
                    setShowModal(true);
                  }}
                >
                  <i className="fas fa-comment"></i> {post.comments?.length || 0}
                </button>
                <button 
                  className="read-more"
                  onClick={() => navigate(`/posts/${post._id}`)}
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {showModal && selectedPost && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="post-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowModal(false)}>
              &times;
            </button>
            
            <div className="modal-content">
              <div className="modal-header">
                <h2>{selectedPost.title}</h2>
                <p className="post-meta">
                  By {selectedPost.createdBy?.username || 'Admin'} • {formatDate(selectedPost.createdAt)}
                </p>
              </div>

              <div className="modal-body">
                {selectedPost.images?.map((image, index) => (
                  <img 
                    key={index} 
                    src={image.url} 
                    alt={`${selectedPost.title} ${index + 1}`} 
                    className="modal-image"
                  />
                ))}
                <div className="post-content" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
              </div>

              <div className="modal-actions">
                <button 
                  className={`like-btn ${selectedPost.likes?.some(like => like.user === user?.userId) ? 'liked' : ''}`}
                  onClick={() => handleLike(selectedPost._id)}
                  disabled={isLiking}
                >
                  <i className="fas fa-heart"></i> {selectedPost.likes?.length || 0} Likes
                </button>
              </div>

              <div className="comments-section">
                <h3>Comments ({selectedPost.comments?.length || 0})</h3>
                
                {user ? (
                  <form onSubmit={handleComment} className="comment-form">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows="3"
                    />
                    <button type="submit" className="submit-comment">
                      Post Comment
                    </button>
                  </form>
                ) : (
                  <p className="login-prompt">
                    Please <button onClick={() => navigate('/login')}>login</button> to leave a comment.
                  </p>
                )}

                <div className="comments-list">
                  {selectedPost.comments?.map((comment) => (
                    <div key={comment._id} className="comment">
                      <div className="comment-header">
                        <span className="comment-author">
                          {comment.user?.username || 'Anonymous'}
                        </span>
                        <span className="comment-date">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="comment-content">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechBlog;