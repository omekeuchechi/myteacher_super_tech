import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/Authcontext';
import { toast, ToastContainer } from 'react-toastify';
import Pusher from 'pusher-js';
import AdminNav from '../../components/adminCom/navSection';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/dashboard/setting.css';
import '../../assets/styles/admin/profile.css';


// countries images
import myteacherNigeria from '../../assets/illustrations/myteacher_nigeria.png';
import myteacherGhana from '../../assets/illustrations/myteacher_ghana.png';
import myteacherKenya from '../../assets/illustrations/myteacher_kenya.png';
import myteacherSouthAfrica from '../../assets/illustrations/myteacher_south-africa.png';
import myteacherUsa from '../../assets/illustrations/myteacher_usa.png';
import myteacherUnitedKingdom from '../../assets/illustrations/myteacher_united-kingdom.png';
import myteacherCanada from '../../assets/illustrations/myteacher_canada.png';
import myteacherIndia from '../../assets/illustrations/myteacher_india.png';

// Country data with flags and states
const statesByCountry = {
  Nigeria: {
    flag: myteacherNigeria,
    states: [
      "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
      "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
      "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
      "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
      "Taraba", "Yobe", "Zamfara"
    ]
  },
  Ghana: {
    flag: myteacherGhana,
    states: [
      "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra",
      "North East", "Northern", "Oti", "Savannah", "Upper East", "Upper West", "Volta",
      "Western", "Western North"
    ]
  },
  Kenya: {
    flag: myteacherKenya,
    states: [
      "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa", "Homa Bay",
      "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii",
      "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera",
      "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi",
      "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita Taveta", "Tana River",
      "Tharaka Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
    ]
  },
  "South Africa": {
    flag: '/flags/south-africa.png',
    states: [
      "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga",
      "Northern Cape", "North West", "Western Cape"
    ]
  },
  "United States": {
    flag: '/flags/usa.png',
    states: [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
      "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
      "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
      "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
      "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
      "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
      "Wisconsin", "Wyoming"
    ]
  },
  "United Kingdom": {
    flag: '/flags/uk.png',
    states: [
      "England", "Northern Ireland", "Scotland", "Wales"
    ]
  },
  Canada: {
    flag: '/flags/canada.png',
    states: [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
      "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
      "Quebec", "Saskatchewan", "Yukon"
    ]
  },
  India: {
    flag: '/flags/india.png',
    states: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
      "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
      "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
      "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
      "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
    ]
  }
};

// Environment variables
const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000";
const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY || '';
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || '';

const SECTION_LIST = [
  { key: 'password', label: 'Change Password', icon: 'fa-key' },
  { key: 'profile', label: 'Change Profile', icon: 'fa-user-edit' },
  { key: 'country', label: 'Set Date of Birth, State & Country', icon: 'fa-flag' },
  { key: 'userinfo', label: 'User Info (Profile Details)', icon: 'fa-id-card' },
  { key: 'storyImage', label: 'Story Image', icon: 'fa-image' },
  { key: 'storyVideo', label: 'Story Video', icon: 'fa-video' },
  { key: 'profileImage', label: 'Profile Image', icon: 'fa-user-circle' },
];

const navLinks = [
  { to: "/", label: "Home" },
  // { to: "/admin/ui-settings", label: "UI Settings" },
  { to: "/admin/take-lecture", label: "Take Lecture" },
  { to: "/admin/profile", label: "Profile" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/transactions", label: "Transactions" },
  { to: "/admin/enrollments", label: "Enrollment" },
  { to: "/admin/admin-list", label: "Admin List" },
  { to: "/admin/contact-messages", label: "Contact Messages" },
  // { to: "/admin/publish-asset", label: "Publish Asset" },
  // { to: "/admin/post-blog", label: "Post Blog" },
  // { to: "/admin/mailer", label: "Mailer" },
];

const Profile = () => {
  const pusherRef = useRef(null);
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form state
  const [formState, setFormState] = useState({
    password: '',
    confirmPassword: '',
    name: user?.name || '',
    email: user?.email || '',
    country: user?.country || '',
    stateOfOrigin: user?.city || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.substring(0, 10) : '',
    address: user?.address || '',
    about: user?.about || '',
    aboutYourSelf: '',
    hobbies: '',
    marritaStatus: '',
  });

  // Media state
  const [mediaState, setMediaState] = useState({
    profileImage: null,
    previewImage: user?.avatar || null,
    storyImage: '',
    storyVideo: '',
    storyImageFile: null,
    storyVideoFile: null,
  });

  // UI state
  const [uiState, setUiState] = useState({
    userInfoExists: false,
    storyImageUploading: false,
    storyVideoUploading: false,
    modalLoading: false,
    openSection: null,
  });

  // Update form state when user data changes
  useEffect(() => {
    if (user) {
      setFormState(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        country: user.country || '',
        stateOfOrigin: user.city || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.substring(0, 10) : '',
        address: user.address || '',
        about: user.about || ''
      }));

      if (user.avatar) {
        setMediaState(prev => ({
          ...prev,
          previewImage: user.avatar
        }));
      }
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (e, field) => {
    setFormState(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Handle file changes
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (fileType === 'profileImage') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaState(prev => ({
          ...prev,
          previewImage: reader.result,
          profileImage: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update with country, state, and date of birth
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUiState(prev => ({ ...prev, modalLoading: true }));

    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: formState.name,
        email: formState.email,
        country: formState.country,
        city: formState.stateOfOrigin,
        dateOfBirth: formState.dateOfBirth,
        address: formState.address,
        about: formState.about
      };

      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated successfully!');
        if (updateUser && data.user) {
          updateUser(data.user);
        }
        setUiState(prev => ({ ...prev, openSection: null }));
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setUiState(prev => ({ ...prev, modalLoading: false }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e, section) => {
    e.preventDefault();
    setUiState(prev => ({ ...prev, modalLoading: true }));

    try {
      if (section === 'profile' || section === 'country') {
        await handleProfileUpdate(e);
        return;
      }

      const token = localStorage.getItem('token');
      let endpoint = `${API_BASE}/user/profile`;
      let method = 'PATCH';
      let body = {};

      // Prepare request data based on section
      switch (section) {
        case 'password':
          if (formState.password !== formState.confirmPassword) {
            throw new Error('Passwords do not match');
          }
          body = { password: formState.password };
          break;

        case 'profile':
          body = {
            name: formState.name,
            email: formState.email,
            phoneNumber: formState.phoneNumber,
            dateOfBirth: formState.dateOfBirth,
            country: formState.country,
            city: formState.stateOfOrigin
          };
          break;

        case 'country':
          body = {
            country: formState.country,
            city: formState.stateOfOrigin,
            dateOfBirth: formState.dateOfBirth
          };
          break;

        case 'userinfo':
          body = {
            aboutYourSelf: formState.aboutYourSelf,
            hobbies: formState.hobbies,
            marritaStatus: formState.marritaStatus,
            address: formState.address
          };
          break;

        default:
          throw new Error('Invalid section');
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to update ${section}`);
      }

      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully`);
      updateUser(data.user || data);
      setUiState(prev => ({ ...prev, openSection: null }));
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setUiState(prev => ({ ...prev, modalLoading: false }));
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = async (e) => {
    e.preventDefault();
    if (!mediaState.profileImage) return;
  
    setUiState(prev => ({ ...prev, modalLoading: true }));
  
    try {
      const token = localStorage.getItem('token');
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1]; // Remove the data URL prefix
        
        try {
          const response = await fetch(`${API_BASE}/user/profile_image`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              imageBase64: base64String,
              filename: mediaState.profileImage.name,
              mimetype: mediaState.profileImage.type
            })
          });
  
          const data = await response.json();
  
          if (!response.ok) {
            throw new Error(data.message || 'Failed to upload image');
          }
  
          toast.success('Profile image updated successfully');
          updateUser(data.user);
          setUiState(prev => ({ ...prev, openSection: null }));
        } catch (error) {
          console.error('Upload error:', error);
          toast.error(error.message || 'An error occurred');
          setUiState(prev => ({ ...prev, modalLoading: false }));
        }
      };
  
      // Read the image file as a data URL
      reader.readAsDataURL(mediaState.profileImage);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred while processing the image');
      setUiState(prev => ({ ...prev, modalLoading: false }));
    }
  };

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaState(prev => ({
        ...prev,
        previewImage: reader.result,
        profileImage: file
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle story image upload
  const handleStoryImageUpload = async (e) => {
    e.preventDefault();
    if (!mediaState.storyImageFile) return;

    setUiState(prev => ({ ...prev, modalLoading: true }));

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('storyImage', mediaState.storyImageFile);

      const response = await fetch(`${API_BASE}/user/story_image`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload story image');
      }

      toast.success('Story image updated successfully');
      updateUser(data.user);
      setUiState(prev => ({ ...prev, openSection: null }));
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setUiState(prev => ({ ...prev, modalLoading: false }));
    }
  };

  // Handle story video upload
  const handleStoryVideoUpload = async (e) => {
    e.preventDefault();
    if (!mediaState.storyVideoFile) return;

    setUiState(prev => ({ ...prev, modalLoading: true }));

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('storyVideo', mediaState.storyVideoFile);

      const response = await fetch(`${API_BASE}/user/story_video`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload story video');
      }

      toast.success('Story video updated successfully');
      updateUser(data.user);
      setUiState(prev => ({ ...prev, openSection: null }));
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setUiState(prev => ({ ...prev, modalLoading: false }));
    }
  };

  // Handle file input change for story media
  const handleStoryMediaChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'storyImage') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaState(prev => ({
          ...prev,
          storyImage: reader.result,
          storyImageFile: file
        }));
      };
      reader.readAsDataURL(file);
    } else if (type === 'storyVideo') {
      setMediaState(prev => ({
        ...prev,
        storyVideo: URL.createObjectURL(file),
        storyVideoFile: file
      }));
    }
  };

  // Render modal content based on section
  const renderModalContent = () => {
    if (!uiState.openSection) return null;

    const handleModalSubmit = (e) => {
      e.preventDefault();
      handleSubmit(e, uiState.openSection);
    };

    switch (uiState.openSection) {
      case 'country':
        return (
          <div className="modal-content-wrapper">
            <h2>Update Location & Details</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label>Country</label>
                <div className="country-select-wrapper">
                  <select
                    value={formState.country}
                    onChange={(e) => {
                      setFormState(prev => ({
                        ...prev,
                        country: e.target.value,
                        stateOfOrigin: '' // Reset state when country changes
                      }));
                    }}
                    required
                  >
                    <option value="">Select Country</option>
                    {Object.keys(statesByCountry).map(country => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {formState.country && statesByCountry[formState.country]?.flag && (
                    <img
                      src={statesByCountry[formState.country].flag}
                      alt={formState.country}
                      className="country-flag"
                      style={{
                        width: '24px',
                        height: '16px',
                        marginLeft: '10px',
                        borderRadius: '2px'
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>State/Region</label>
                {formState.country && statesByCountry[formState.country] ? (
                  <select
                    value={formState.stateOfOrigin}
                    onChange={(e) => handleInputChange(e, 'stateOfOrigin')}
                    required
                  >
                    <option value="">Select State/Region</option>
                    {statesByCountry[formState.country].states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formState.stateOfOrigin || ''}
                    onChange={(e) => handleInputChange(e, 'stateOfOrigin')}
                    placeholder="Enter your state/region"
                    required
                  />
                )}
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={formState.dateOfBirth || ''}
                  onChange={(e) => handleInputChange(e, 'dateOfBirth')}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setUiState(prev => ({ ...prev, openSection: null }))}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={uiState.modalLoading}
                >
                  {uiState.modalLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        );

      case 'profile':
        return (
          <div className="modal-content-wrapper">
            <h2>Update Profile</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formState.name || ''}
                  onChange={(e) => handleInputChange(e, 'name')}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formState.email || ''}
                  onChange={(e) => handleInputChange(e, 'email')}
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setUiState(prev => ({ ...prev, openSection: null }))}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={uiState.modalLoading}
                >
                  {uiState.modalLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        );

      case 'password':
        return (
          <div className="modal-content-wrapper">
            <h2>Change Password</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={formState.password || ''}
                  onChange={(e) => handleInputChange(e, 'password')}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={formState.confirmPassword || ''}
                  onChange={(e) => handleInputChange(e, 'confirmPassword')}
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setUiState(prev => ({ ...prev, openSection: null }))}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        );

      case 'userinfo':
        return (
          <div className="modal-content-wrapper">
            <h2>Update Profile Details</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label>About Yourself</label>
                <textarea
                  value={formState.aboutYourSelf || ''}
                  onChange={(e) => handleInputChange(e, 'aboutYourSelf')}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Hobbies</label>
                <input
                  type="text"
                  value={formState.hobbies || ''}
                  onChange={(e) => handleInputChange(e, 'hobbies')}
                  placeholder="Reading, Traveling, etc."
                />
              </div>
              <div className="form-group">
                <label>Marital Status</label>
                <select
                  value={formState.marritaStatus || ''}
                  onChange={(e) => handleInputChange(e, 'marritaStatus')}
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setUiState(prev => ({ ...prev, openSection: null }))}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        );

      case 'storyImage':
        return (
          <div className="modal-content-wrapper">
            <h2>Update Story Image</h2>
            <form onSubmit={handleStoryImageUpload}>
              <div className="image-upload-container">
                {mediaState.storyImage ? (
                  <img
                    src={mediaState.storyImage}
                    alt="Story Preview"
                    className="image-preview"
                    style={{ maxHeight: '300px' }}
                  />
                ) : (
                  <div className="upload-placeholder">
                    <i className="fas fa-image"></i>
                    <span>No image selected</span>
                  </div>
                )}
                <label className="file-upload-btn">
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleStoryMediaChange(e, 'storyImage')}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setUiState(prev => ({ ...prev, openSection: null }))}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!mediaState.storyImageFile}
                >
                  Upload Image
                </button>
              </div>
            </form>
          </div>
        );

      case 'storyVideo':
        return (
          <div className="modal-content-wrapper">
            <h2>Update Story Video</h2>
            <form onSubmit={handleStoryVideoUpload}>
              <div className="video-upload-container">
                {mediaState.storyVideo ? (
                  <video
                    controls
                    className="video-preview"
                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                  >
                    <source src={mediaState.storyVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="upload-placeholder">
                    <i className="fas fa-video"></i>
                    <span>No video selected</span>
                  </div>
                )}
                <label className="file-upload-btn">
                  Choose Video
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleStoryMediaChange(e, 'storyVideo')}
                    style={{ display: 'none' }}
                  />
                </label>
                <p className="file-info">
                  {mediaState.storyVideoFile ? mediaState.storyVideoFile.name : 'No file selected'}
                </p>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setUiState(prev => ({ ...prev, openSection: null }))}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!mediaState.storyVideoFile}
                >
                  Upload Video
                </button>
              </div>
            </form>
          </div>
        );

      case 'profileImage':
        return (
          <div className="modal-content-wrapper">
            <h2>Update Profile Image</h2>
            <form onSubmit={handleProfileImageUpload}>
              <div className="image-upload-container">
                {mediaState.previewImage ? (
                  <img
                    src={mediaState.previewImage}
                    alt="Profile Preview"
                    className="image-preview"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <i className="fas fa-user"></i>
                    <span>No image selected</span>
                  </div>
                )}
                <label className="file-upload-btn">
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setUiState(prev => ({ ...prev, openSection: null }))}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!mediaState.profileImage}
                >
                  Upload Image
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return (
          <div className="modal-content-wrapper">
            <h2>Coming Soon</h2>
            <p>This feature is under development.</p>
            <div className="form-actions">
              <button
                className="btn-secondary"
                onClick={() => setUiState(prev => ({ ...prev, openSection: null }))}
              >
                Close
              </button>
            </div>
          </div>
        );
    }
  };

  // Get modal content based on the current open section
  const getModalContent = () => {
    if (!uiState.openSection) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button
            className="modal-close"
            onClick={() => setUiState(prev => ({ ...prev, openSection: null }))}
          >
            <i className="fas fa-times"></i>
          </button>
          {renderModalContent()}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-profile">
      <AdminNav navLinks={navLinks} onClick={logout} />
      <div className="profile-container">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"  // Add this line for dark theme
          toastStyle={{
            backgroundColor: '#2c2f33',  // Dark background
            color: '#ffffff'  // White text
          }}
        />

        <div className="profile-header">
          <h1>Profile Settings</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className="profile-sections">
          {SECTION_LIST.map((section) => (
            <div
              key={section.key}
              className="profile-section-card"
              onClick={() => {
                if (section.key === 'profileImage' && user?.googleId) {
                  toast.error("Profile image update not allowed for Google-authenticated users.");
                  return;
                }
                setUiState(prev => ({ ...prev, openSection: section.key }));
              }}
            >
              <div className="section-icon">
                <i className={`fas ${section.icon}`}></i>
              </div>
              <div className="section-content">
                <h3>{section.label}</h3>
                <p>Update your {section.label.toLowerCase()}</p>
              </div>
              <div className="section-arrow">
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          ))}
        </div>

        {uiState.openSection && getModalContent()}

        {user && (
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#777' }}>
            Logged in as: {user.name} ({user.email})
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
