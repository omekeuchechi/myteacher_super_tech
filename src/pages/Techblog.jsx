import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/Authcontext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import '../assets/styles/techblog.css';
import Pusher from 'pusher-js';
import Nav from '../components/nav';

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
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/posts?page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data.posts || data.data || []);
      setTotalPages(data.totalPages || data.pagination?.totalPages || 1);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error(error.message || 'Failed to load posts. Please try again later.');
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

    if (isLiking) return; // Prevent multiple clicks
    
    setIsLiking(true);
    try {
      const post = posts.find(p => p._id === postId) || selectedPost;
      if (!post) {
        throw new Error('Post not found');
      }

      // Check if user has already liked the post
      const hasLiked = post.likes?.some(like => 
        like.user === user.userId || like.user?._id === user.userId
      );
      
      // Use the correct endpoint based on whether user has liked the post
      const endpoint = `${API_BASE}/posts/${postId}/${hasLiked ? 'unlike' : 'like'}`;
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update like');
      }
      
      const result = await response.json();
      
      // Update local state with the updated post from the server
      const updatePostLikes = (post) => {
        const updatedLikes = result?.post?.likes || result?.likes || [];
        return {
          ...post,
          likes: updatedLikes,
          likeCount: updatedLikes.length
        };
      };
      
      // Update posts list
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p._id === postId ? updatePostLikes(p) : p
        )
      );
      
      // Update selected post if it's the one being liked/unliked
      if (selectedPost?._id === postId) {
        setSelectedPost(prev => updatePostLikes(prev));
      }
      
    } catch (error) {
      console.error('Error updating like:', error);
      // Don't show error if it's just that the user hasn't liked the post
      if (!error.message.includes('not liked')) {
        toast.error(error.message || 'Failed to update like. Please try again.');
      }
    } finally {
      setIsLiking(false);
    }
  };

  // Handle comment submission
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !selectedPost) return;

    const commentToSubmit = comment;
    setComment(''); // Clear input immediately for better UX

    try {
      const response = await fetch(
        `${API_BASE}/comments/${selectedPost._id}/postComment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ content: commentToSubmit })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }
      
      const result = await response.json();
      
      // Update the selected post with the new comment
      if (result.postComment) {
        setSelectedPost(prev => ({
          ...prev,
          comments: [...(prev.comments || []), result.postComment]
        }));
        
        // Update the posts array to reflect the new comment count
        setPosts(prevPosts => 
          prevPosts.map(p => 
            p._id === selectedPost._id 
              ? { 
                  ...p, 
                  comments: [...(p.comments || []), result.postComment] 
                } 
              : p
          )
        );
        
        toast.success('Comment added successfully!');
      } else {
        // If comment data isn't in the response, refetch the post
        fetchPostDetails(selectedPost._id);
      }
      
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(`Failed to add comment: ${error.message}`);
      setComment(commentToSubmit); // Restore the comment if there was an error
    }
  };
  
  // Fetch detailed post data when a post is selected
  const fetchPostDetails = async (postId) => {
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        fetch(`${API_BASE}/posts/${postId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch(`${API_BASE}/comments/comments`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);
      
      if (!postResponse.ok || !commentsResponse.ok) {
        throw new Error('Failed to fetch post details');
      }
      
      const postData = await postResponse.json();
      const commentsData = await commentsResponse.json();
      
      // Filter comments for this post
      const postComments = commentsData.filter(comment => 
        comment.post === postId && !comment.parentComment
      );
      
      setSelectedPost({
        ...postData.post || postData,
        comments: postComments
      });
      
    } catch (error) {
      console.error('Error fetching post details:', error);
      toast.error('Failed to load post details');
    }
  };
  
  // Update modal post data when selectedPost changes
  useEffect(() => {
    if (showModal && selectedPost?._id) {
      fetchPostDetails(selectedPost._id);
    }
  }, [showModal]);

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

  if (loading && page === 1) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <>
    <Nav />
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
        {posts.length === 0 ? (
          <div className="no-posts">
            <h3>No posts found</h3>
            {user?.isAdmin && (
              <button 
                className="create-post-btn"
                onClick={() => navigate('/create-post')}
              >
                Create Your First Post
              </button>
            )}
          </div>
        ) : posts.map((post) => (
          <div key={post._id} className="post-card">
            {post.featuredImage && (
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="post-image"
                onClick={() => {
                  setSelectedPost(post);
                  setShowModal(true);
                }}
              />
            )}
            <div className="post-content">
              {post.images.map((image) => (
                <img src={image.url} className="post-image" alt={post.title} />
              ))}
              <h3>{post.title}</h3>
              <p className="post-meta">
                By {post.createdBy?.username || 'Admin'} • {formatDate(post.createdAt)}
              </p>
              <div className="post-excerpt">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {post.content || 'No content available'}
                </ReactMarkdown>
              </div>
              <div className="post-actions">
                <button 
                  className={`like-btn ${post.likes?.some(like => like.user === user?.userId) ? 'liked' : ''}`}
                  onClick={() => handleLike(post._id)}
                  disabled={isLiking}
                >
                  <i className="fas fa-heart"></i> {post.likes?.length || 0} Likes
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
                {selectedPost.featuredImage && (
                  <img 
                    src={selectedPost.featuredImage} 
                    alt={selectedPost.title}
                    className="modal-featured-image"
                  />
                )}
                {selectedPost.images?.length > 0 && (
                  <div className="post-gallery">
                    {selectedPost.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={typeof image === 'string' ? image : image.url} 
                        alt={`${selectedPost.title} ${index + 1}`} 
                        className="gallery-image"
                      />
                    ))}
                  </div>
                )}
                <div className="post-content">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {selectedPost.content || 'No content available'}
                  </ReactMarkdown>
                </div>
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
                          {comment.createdBy?.username || 'Anonymous'}
                        </span>
                        <span className="comment-date">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <div className="comment-content">
                        {comment.content}
                      </div>
                      {/* Add reply functionality here if needed */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default TechBlog;