import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/userDashCom/header';
import '../assets/styles/dashboard/generalProfile.css';

const GeneralProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(location.state?.userData?.data || null);
  const [isLoading, setIsLoading] = useState(!location.state?.userData);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

  // Check if current user is following this profile
  const checkFollowStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !profile?.createdBy?._id) {
        setIsFollowing(false);
        return;
      }

      const response = await fetch(`${API_BASE}/social/is-following/${profile.createdBy._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      } else {
        const error = await response.json();
        console.error('Error checking follow status:', error);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
      setIsFollowing(false);
    }
  }, [profile?.createdBy?._id, API_BASE]);

  const fetchUserProfile = useCallback(async () => {
    if (location.state?.userData) {
      setProfile(location.state.userData);
      setIsLoading(false);
      return;
    }

    if (!userId) {
      toast.error('User not found');
      navigate('/profile');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/user_info/profile/${userId}`, {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } : {}
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.data || data); // Handle both response formats
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error(error.message || 'Failed to load profile');
      navigate('/profile');
    } finally {
      setIsLoading(false);
    }
  }, [userId, navigate, location.state, API_BASE]);

  const handleFollowToggle = async () => {
    if (!profile?.createdBy?._id) return;
    
    try {
      setIsFollowLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const response = await fetch(`${API_BASE}/social/${endpoint}/${profile.createdBy._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update follow status');
      }

      // Toggle the follow state
      const newFollowState = !isFollowing;
      setIsFollowing(newFollowState);
      toast.success(`Successfully ${newFollowState ? 'followed' : 'unfollowed'} user`);
      
      // Update the profile data to reflect the change
      setProfile(prev => {
        if (!prev) return prev;
        const updated = { ...prev };
        updated.followersCount = (updated.followersCount || 0) + (newFollowState ? 1 : -1);
        return updated;
      });

    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error(error.message || 'Failed to update follow status');
    } finally {
      setIsFollowLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId, fetchUserProfile]);

  useEffect(() => {
    if (profile?.createdBy?._id) {
      checkFollowStatus();
    }
  }, [profile?.createdBy?._id, checkFollowStatus]);

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-error">
        <p>Profile not found</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const userInfo = profile.createdBy || {};

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="user-profile-card">
          <div className="profile-header">
            <img 
              src={profile.storyImage} 
              alt="Cover" 
              className="cover-photo"
            />
            <div className="profile-avatar-container">
              <img 
                src={userInfo.avatar} 
                alt={userInfo.name || 'User'} 
                className="profile-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png';
                }}
              />
            </div>
          </div>
          
          <div className="profile-body">
            <div className="profile-info">
              <h1>{userInfo.name || 'User'}</h1>
              {userInfo.isAdmin ? (
                <p className="user-role" style={{color: 'red', fontSize: '1.5rem'}}>Admin</p>
              ) : (
                <p className="user-role" style={{color: 'green', fontSize: '1.5rem'}}>Student</p>
              )}
              
              <div className="profile-actions">
                <button 
                  className={`follow-btn ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                >
                  <i className={`fas fa-${isFollowing ? 'user-check' : 'user-plus'}`}></i>
                  {isFollowLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
              
              {profile.aboutYourSelf && (
                <div className="profile-bio">
                  <h3>About Me</h3>
                  <p style={{ whiteSpace: 'pre-line' }}>{profile.aboutYourSelf}</p>
                </div>
              )}
              
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">{profile.followersCount || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{profile.followingCount || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
              
              <div className="profile-details">
                {profile.hobbies && (
                  <div className="detail-item">
                    <i className="fas fa-heart detail-icon"></i>
                    <span className="detail-value">{profile.hobbies}</span>
                  </div>
                )}
                
                {profile.marritaStatus && (
                  <div className="detail-item">
                    <i className="fas fa-heart detail-icon"></i>
                    <span className="detail-value">{profile.marritaStatus}</span>
                  </div>
                )}
                
                {profile.address && (
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt detail-icon"></i>
                    <span className="detail-value">{profile.address}</span>
                  </div>
                )}
              </div>
              {console.log(profile)}
              <div className="profile-video">
                {profile.storyVideo ? (
                  <video src={profile.storyVideo} controls></video>
                ) : (
                  <p>No video found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralProfile;