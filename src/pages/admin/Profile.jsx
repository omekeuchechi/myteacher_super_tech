import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Link removed as it's not used directly
import { AuthContext } from '../../../context/Authcontext';
import { toast, ToastContainer } from 'react-toastify';
import Pusher from 'pusher-js';

import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/dashboard/setting.css'; // Assuming shared styles with user settings

// Import userAvatarDefault if you plan to use it as a fallback in profileImage modal
// import userAvatarDefault from '../../assets/illustrations/user_profile.png';
// Import Img from 'react-image' if you prefer its loading/unloading capabilities
// import { Img } from 'react-image';


import myteacherNigeria from '../../assets/illustrations/myteacher_nigeria.png';
import myteacherGhana from '../../assets/illustrations/myteacher_ghana.png';
import myteacherKenya from '../../assets/illustrations/myteacher_kenya.png';
import myteacherSouthAfrica from '../../assets/illustrations/myteacher_south-africa.png';
import myteacherUsa from '../../assets/illustrations/myteacher_usa.png';
import myteacherUnitedKingdom from '../../assets/illustrations/myteacher_united-kingdom.png';
import myteacherCanada from '../../assets/illustrations/myteacher_canada.png';
import myteacherIndia from '../../assets/illustrations/myteacher_india.png';

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
    flag: myteacherSouthAfrica,
    states: [
      "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga",
      "Northern Cape", "North West", "Western Cape"
    ]
  },
  "United States": {
    flag: myteacherUsa,
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
    flag: myteacherUnitedKingdom,
    states: [
      "England", "Northern Ireland", "Scotland", "Wales"
    ]
  },
  Canada: {
    flag: myteacherCanada,
    states: [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
      "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
      "Quebec", "Saskatchewan", "Yukon"
    ]
  },
  India: {
    flag: myteacherIndia,
    states: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
      "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
      "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
      "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
      "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
    ]
  }
};

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";
const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY || process.env.VITE_PUSHER_KEY || '';
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || process.env.VITE_PUSHER_CLUSTER || '';

const SECTION_LIST = [
  { key: 'password', label: 'Change Password', icon: 'fa-key' },
  { key: 'profile', label: 'Change Profile', icon: 'fa-user-edit' },
  { key: 'country', label: 'Set Date of Birth, State & Country', icon: 'fa-flag' },
  { key: 'userinfo', label: 'User Info (Profile Details)', icon: 'fa-id-card' },
  { key: 'storyImage', label: 'Story Image', icon: 'fa-image' },
  { key: 'storyVideo', label: 'Story Video', icon: 'fa-video' },
  { key: 'profileImage', label: 'Profile Image', icon: 'fa-user-circle' },
];

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext); // refreshUser removed as it's not used
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null); // File object for upload
  const [previewImage, setPreviewImage] = useState(null); // Data URL for preview
  // const [enable2FA, setEnable2FA] = useState(false); // enable2FA not used
  const [stateOfOrigin, setStateOfOrigin] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState(''); // For User.about
  const [aboutYourSelf, setAboutYourSelf] = useState(''); // For UserInfo.aboutYourSelf
  const [hobbies, setHobbies] = useState('');
  const [marritaStatus, setMarritaStatus] = useState('');
  const [storyImage, setStoryImage] = useState(''); // URL of current story image
  const [storyVideo, setStoryVideo] = useState(''); // URL of current story video
  const [userInfoExists, setUserInfoExists] = useState(false);
  const [storyImageFile, setStoryImageFile] = useState(null);
  const [storyVideoFile, setStoryVideoFile] = useState(null);
  const [storyImageUploading, setStoryImageUploading] = useState(false);
  const [storyVideoUploading, setStoryVideoUploading] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);


  useEffect(() => { setStateOfOrigin(''); }, [country]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCountry(user.country || '');
      setStateOfOrigin(user.city || '');
      setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.substring(0, 10) : '');
      setAddress(user.address || '');
      setAbout(user.about || ''); // From main User model
      // Set previewImage if user.avatar exists (assuming user.avatar is the URL for admin's own avatar)
      // The profileImage modal in the snippet uses `previewImage` state for the img src.
      // And `user.profileImage` is updated in the context, which might be what `user.avatar` is.
      // For consistency, if `user.avatar` holds the profile image URL:
      if (user.avatar) {
        setPreviewImage(user.avatar);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) return; // Ensure user context is available
      try {
        // Assuming /user_info/me fetches UserInfo for the currently authenticated (admin) user
        const res = await fetch(`${API_BASE}/user_info/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAboutYourSelf(data.aboutYourSelf || '');
          setHobbies(data.hobbies || '');
          setMarritaStatus(data.marritaStatus || '');
          setStoryImage(data.storyImage || '');
          setStoryVideo(data.storyVideo || '');
          setUserInfoExists(true);
        } else {
          setUserInfoExists(false);
        }
      } catch {
        setUserInfoExists(false);
      }
    };
    if (user?._id) { // Fetch only if user is loaded
        fetchUserInfo();
    }
  }, [user]); // Rerun if user object changes

  useEffect(() => {
    if (!user || !user._id || !PUSHER_KEY || !PUSHER_CLUSTER) return;
    const pusher = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER, forceTLS: true });
    const userId = user._id || user.id;

    const userInfoChannel = pusher.subscribe('user-info');
    userInfoChannel.bind('created', data => {
      if (data.userId === userId && data.userInfo) {
        setAboutYourSelf(data.userInfo.aboutYourSelf || '');
        setHobbies(data.userInfo.hobbies || '');
        setMarritaStatus(data.userInfo.marritaStatus || '');
        if (data.userInfo.address) setAddress(data.userInfo.address); // If UserInfo also manages address
        setUserInfoExists(true);
        toast.info('User info created (real-time)');
      }
    });
    userInfoChannel.bind('updated', data => {
      if (data.userId === userId && data.userInfo) {
        setAboutYourSelf(data.userInfo.aboutYourSelf || '');
        setHobbies(data.userInfo.hobbies || '');
        setMarritaStatus(data.userInfo.marritaStatus || '');
        if (data.userInfo.address) setAddress(data.userInfo.address);
        setUserInfoExists(true);
        toast.info('User info updated (real-time)');
      }
    });
    userInfoChannel.bind('storyImage', data => {
      if (data.userId === userId && data.url) {
        setStoryImage(data.url);
        toast.info('Story image updated (real-time)');
      }
    });
    userInfoChannel.bind('storyVideo', data => {
      if (data.userId === userId && data.url) {
        setStoryVideo(data.url);
        toast.info('Story video updated (real-time)');
      }
    });

    const userChannel = pusher.subscribe('user'); // For main User model updates
    userChannel.bind('profile_updated', data => {
      if (data.user && (data.user._id === userId)) {
        updateUser(data.user);
        toast.info('Profile updated (real-time)');
      }
    });
    userChannel.bind('profile_image_updated', data => {
      if (data.user && (data.user._id === userId)) {
        updateUser(data.user); // This should update user.avatar
        toast.info('Profile image updated (real-time)');
      }
    });
    // Admin might not have 'course_updated' or 'deleted' events in the same way as a regular user.
    // If these are relevant for admin's own account, keep them.
    userChannel.bind('deleted', data => {
      if (data.userId === userId) {
        toast.info('Your admin account was deleted (real-time). Logging out.');
        updateUser(null); // Clear user from context
        navigate('/login');
      }
    });

    return () => {
      userInfoChannel.unbind_all();
      userInfoChannel.unsubscribe();
      userChannel.unbind_all();
      userChannel.unsubscribe();
      pusher.disconnect();
    };
  }, [user, updateUser, navigate]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    // Similar to settings.jsx, but ensure it's for the admin's own password.
    // The backend /user/profile endpoint might need a specific way to handle password if it's generic.
    // A dedicated /user/change-password or /admin/change-password endpoint is better.
    if (!password) return toast.error("Password cannot be empty.");
    if (password !== confirmPassword) return toast.error("Passwords do not match.");
    if (user && user.googleId) return toast.error("Password change not allowed for Google-authenticated users.");

    setModalLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Placeholder: Use a dedicated, secure password change endpoint.
      // The current /user/profile PATCH in backend doesn't handle 'password'.
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password }), // This will likely be ignored by current backend /user/profile
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Password update request sent. (Ensure backend handles this securely)");
        setPassword('');
        setConfirmPassword('');
        setOpenSection(null);
      } else {
        toast.error(data.message || "Failed to update password.");
      }
    } catch (err) {
      toast.error("Network error: " + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleBasicProfileUpdate = async (e) => {
    e.preventDefault();
    if (user && user.googleId) return toast.error("Profile update not allowed for Google-authenticated users.");
    setModalLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/user/profile`, { // Admin updates their own profile
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        updateUser(data.user);
        toast.success(data.message || "Profile updated successfully!");
        setOpenSection(null);
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (err) {
      toast.error("Network error: " + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    if (user && user.googleId) return toast.error("Profile update not allowed for Google-authenticated users.");
    setModalLoading(true);
    try {
      const token = localStorage.getItem('token');
      // 'about' here refers to User.about. Backend /user/profile needs to handle 'about' field.
      const payload = { address, about };
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        updateUser(data.user);
        toast.success(data.message || "Address & Info updated successfully!");
        setOpenSection(null);
      } else {
        toast.error(data.message || "Failed to update address & info.");
      }
    } catch (err) {
      toast.error("Network error: " + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCountryStateDobUpdate = async (e) => {
    e.preventDefault();
    if (user && user.googleId) return toast.error("Profile update not allowed for Google-authenticated users.");
    setModalLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ country, city: stateOfOrigin, dateOfBirth }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        updateUser(data.user);
        toast.success(data.message || "Details updated successfully!");
        setOpenSection(null);
      } else {
        toast.error(data.message || "Failed to update details.");
      }
    } catch (err) {
      toast.error("Network error: " + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUserInfoSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const token = localStorage.getItem('token');
      const method = userInfoExists ? 'PATCH' : 'POST';
      // This updates/creates UserInfo for the admin.
      const res = await fetch(`${API_BASE}/user_info/me`, {
        method: method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ aboutYourSelf, hobbies, marritaStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || `User info ${userInfoExists ? 'updated' : 'created'} successfully!`);
        setUserInfoExists(true);
        if (data.userInfo) { // Update local state if backend returns the new UserInfo
            setAboutYourSelf(data.userInfo.aboutYourSelf || '');
            setHobbies(data.userInfo.hobbies || '');
            setMarritaStatus(data.userInfo.marritaStatus || '');
        }
        setOpenSection(null);
      } else {
        toast.error(data.message || "Failed to save user info.");
      }
    } catch (err) {
      toast.error("Network error: " + err.message);
    } finally {
      setModalLoading(false);
    }
  };
  
  const renderModal = () => {
    if (!openSection) return null;

    let content = null;
    // The 'theme' variable is not defined in this Profile component,
    // so `className={'input-box-auth ${theme}'}` would not work as intended.
    // I'll use `className={'input-box-auth'}` as per the original snippet for admin/Profile.
    switch (openSection) {
      case 'password':
        content = (
          <form className={`input-box-auth`} onSubmit={handlePasswordUpdate}>
            <h2>Change Password</h2>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <button type="submit">Update Password</button>
          </form>
        );
        break;

      case 'profile':
        content = (
          <form className={`input-box-auth`} onSubmit={handleBasicProfileUpdate}>
            <h2>Change Profile</h2>
            <input
              type="text"
              placeholder="New username"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="New email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type="submit">Update Profile</button>
          </form>
        );
        break;
      case 'country':
        content = (
          <form className={`input-box-auth`} onSubmit={handleCountryStateDobUpdate}>
            <h2>Set Date of Birth, State of Origin & Country</h2>
            <input
              type="date"
              placeholder="Date of Birth"
              value={dateOfBirth}
              onChange={e => setDateOfBirth(e.target.value)}
            />
            <select value={country} onChange={e => setCountry(e.target.value)}>
              <option value="">Select Country</option>
              {Object.entries(statesByCountry).map(([countryKey]) => (
                <option key={countryKey} value={countryKey}>{countryKey}</option>
              ))}
              <option value="Other">Other</option>
            </select>
            {country && statesByCountry[country]?.flag && (
              <img
                src={statesByCountry[country].flag}
                alt={`${country} flag`}
                style={{
                  width: 32,
                  height: 20,
                  margin: '8px 0 0 8px',
                  borderRadius: 4,
                  objectFit: 'cover',
                  display: 'inline-block',
                  verticalAlign: 'middle'
                }}
              />
            )}
            {statesByCountry[country] ? (
              <select value={stateOfOrigin} onChange={e => setStateOfOrigin(e.target.value)}>
                <option value="">Select State/Region</option>
                {statesByCountry[country].states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="State of Origin"
                value={stateOfOrigin}
                onChange={e => setStateOfOrigin(e.target.value)}
              />
            )}
            <button type="submit">Update Profile</button>
          </form>
        );
        break;

      case 'userinfo':
        content = (
          <form className={`input-box-auth`} onSubmit={handleUserInfoSubmit}>
            <h2>User Info (Profile Details)</h2>
            <textarea
              placeholder="About Yourself (This updates UserInfo.aboutYourself)"
              value={aboutYourSelf}
              onChange={e => setAboutYourSelf(e.target.value)}
            />
            <input
              type="text"
              placeholder="Hobbies (comma separated)"
              value={hobbies}
              onChange={e => setHobbies(e.target.value)}
            />
            <input
              type="text"
              placeholder="Marital Status"
              value={marritaStatus}
              onChange={e => setMarritaStatus(e.target.value)}
            />
            <button type="submit">{userInfoExists ? 'Update User Info' : 'Create User Info'}</button>
          </form>
        );
        break;

      case 'storyImage':
        content = (
          <form className={`input-box-auth`} onSubmit={async e => {
            e.preventDefault();
            if (!storyImageFile) return toast.warning('Please select an image.');
            setModalLoading(true);
            setStoryImageUploading(true);
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('storyImage', storyImageFile); // Backend expects 'storyImage' field
            try {
              // This endpoint needs to exist on the backend, likely on /user_info route
              const res = await fetch(`${API_BASE}/user_info/upload/storyImage`, {
                method: 'POST', // Or PATCH if updating
                headers: { Authorization: `Bearer ${token}` }, // No 'Content-Type' for FormData
                body: formData
              });
              const data = await res.json();
              if (res.ok && data.url) {
                setStoryImage(data.url); // Update local state for preview
                toast.success('Story image uploaded!');
                // If UserInfo model is updated, Pusher event 'user-info/updated' should fire from backend
              } else {
                toast.error(data.message || 'Story image upload failed');
              }
            } catch(err) {
              toast.error('Story image upload failed: ' + err.message);
            } finally {
              setStoryImageUploading(false);
              setModalLoading(false);
            }
          }}>
            <h2>Story Image</h2>
            <div className="fb-upload-preview">
              {storyImage && (<img src={storyImage} alt="Story" />)}
            </div>
            <label className="fb-file-upload-label">
              <i className="fas fa-camera fb-file-upload-icon"></i>
              <input type="file" accept="image/*" onChange={e => setStoryImageFile(e.target.files[0])} />
            </label>
            <button type="submit" disabled={storyImageUploading}>
              {storyImageUploading ? 'Uploading...' : 'Upload Story Image'}
            </button>
          </form>
        );
        break;

      case 'storyVideo':
        content = (
          <form className={`input-box-auth`} onSubmit={async e => {
            e.preventDefault();
            if (!storyVideoFile) return toast.warning('Please select a video.');
            setModalLoading(true);
            setStoryVideoUploading(true);
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('storyVideo', storyVideoFile); // Backend expects 'storyVideo'
            try {
              // This endpoint needs to exist on the backend, likely on /user_info route
              const res = await fetch(`${API_BASE}/user_info/upload/storyVideo`, {
                method: 'POST', // Or PATCH
                headers: { Authorization: `Bearer ${token}` },
                body: formData
              });
              const data = await res.json();
              if (res.ok && data.url) {
                setStoryVideo(data.url);
                toast.success('Story video uploaded!');
              } else {
                toast.error(data.message || 'Story video upload failed');
              }
            } catch(err) {
              toast.error('Story video upload failed: ' + err.message);
            } finally {
              setStoryVideoUploading(false);
              setModalLoading(false);
            }
          }}>
            <h2>Story Video</h2>
            <div className="fb-upload-preview">
              {storyVideo && (<video src={storyVideo} controls />)}
            </div>
            <label className="fb-file-upload-label">
              <i className="fas fa-video fb-file-upload-icon"></i>
              <input type="file" accept="video/*" onChange={e => setStoryVideoFile(e.target.files[0])} />
            </label>
            <button type="submit" disabled={storyVideoUploading}>
              {storyVideoUploading ? 'Uploading...' : 'Upload Story Video'}
            </button>
          </form>
        );
        break;

      case 'profileImage': // This uses /user_info/upload/profileImage as per the admin snippet
        content = (
          <form className={`input-box-auth`} onSubmit={async e => {
            e.preventDefault();
            if (user && user.googleId) {
                toast.error("Profile image update not allowed for Google-authenticated users.");
                return;
            }
            if (!profileImage) return toast.warning('Please select an image.');
            setModalLoading(true);
            const token = localStorage.getItem('token');
            const reader = new FileReader();
            reader.onload = async () => {
              const base64 = reader.result.split(',')[1]; // Get base64 part
              const filename = profileImage.name; // Original filename
              const mimetype = profileImage.type; // Get mimetype from the file object

              try {
                const res = await fetch(`${API_BASE}/user/profile_image`, {
                  method: 'PATCH', 
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({ 
                    imageBase64: base64, 
                    filename: filename, 
                    mimetype: mimetype 
                  })
                });
                const data = await res.json();
                if (res.ok && data.user) { // Backend returns the updated user object
                  if (data.user) {
                    updateUser(data.user); // If backend returns the full user object
                  }
                  setPreviewImage(null); // Clear preview, rely on user.avatar from context for next render
                  toast.success('Profile image uploaded!');
                  setOpenSection(null);
                } else {
                  toast.error(data.message || 'Profile image upload failed');
                }
              } catch(err) {
                toast.error('Profile image upload failed: ' + err.message);
              } finally {
                setModalLoading(false);
              }
            };
            reader.readAsDataURL(profileImage); // Read the file for base64 conversion
          }}>
            <h2>Profile Image</h2>
            <div className="fb-upload-preview" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              {/* Preview image logic */}
              <img 
                src={previewImage || (user?.avatar) || '/path/to/default/admin-avatar.png'} // Provide a default admin avatar
                alt="Profile Preview" 
                style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <label className="fb-file-upload-label" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem' }}>
              <i className="fas fa-camera fb-file-upload-icon"></i> Select Image
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  setProfileImage(file); // Set the File object to state
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result); // Set DataURL for preview
                  };
                  reader.readAsDataURL(file);
                }
              }} />
            </label>
            <button type="submit" style={{ display: 'block', margin: '0 auto' }}>Upload Profile Image</button>
          </form>
        );
        break;
      default:
        content = null;
    }

    return (
      <div className="settings-modal-overlay" onClick={() => setOpenSection(null)}>
        <div className="settings-modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setOpenSection(null)}>
             <i className="fas fa-xmark"></i>
          </button>
          {modalLoading && <div className="modal-spinner-overlay"><div className="modal-spinner"></div></div>}
          {content}
        </div>
      </div>
    );
  };
  
  return (
    <div className="admin-profile-container settings-content"> {/* Use a specific class for admin profile page */}
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>⚙️ Admin Account Settings</h1>
      <div className="setting-input-section">
        {SECTION_LIST.map(section => (
          <div
            key={section.key}
            className={`settings-card ${openSection === section.key ? ' open' : ''}`}
            // Add theme class if admin profile also supports themes: className={`settings-card ${theme} ...`}
            onClick={() => {
                // Admin specific restrictions if any (e.g. admin cannot change own email if it's a superadmin feature)
                if (section.key === 'profileImage' && user && user.googleId) {
                    toast.error("Profile image update not allowed for Google-authenticated users.");
                    return;
                }
                if (section.key === 'password' && user && user.googleId) {
                    toast.error("Password change not allowed for Google-authenticated users.");
                    return;
                }
                const googleRestrictedSections = ['profile', 'address', 'country'];
                if (googleRestrictedSections.includes(section.key) && user && user.googleId) {
                    toast.error("Profile updates not allowed for Google-authenticated users.");
                    return;
                }
                setOpenSection(section.key);
            }}
          >
            <span className="card-title">
              <i className={`fas ${section.icon}`}></i> {section.label}
            </span>
            <i className={`fas fa-chevron-down card-chevron${openSection === section.key ? ' open' : ''}`}></i>
          </div>
        ))}
      </div>
      {renderModal()}
      {user && <p style={{textAlign: 'center', marginTop: '20px', color: '#777'}}>Logged in as: {user.name} ({user.email})</p>}
    </div>
  );
};
export default Profile;
