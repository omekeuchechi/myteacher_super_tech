import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/Authcontext';
import { toast, ToastContainer } from 'react-toastify';
import Pusher from 'pusher-js';

import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/dashboard/setting.css';
import '../assets/styles/dashboard/UserDashboard.css';
import DashMobileNav from '../components/userDashCom/dashMobileNav';
import FullscreenIcon from '../components/userDashCom/fullscreenIcon';

import userAvatarDefault from '../assets/illustrations/user_profile.png';
import { Img } from 'react-image';

import myteacherNigeria from '../assets/illustrations/myteacher_nigeria.png';
import myteacherGhana from '../assets/illustrations/myteacher_ghana.png';
import myteacherKenya from '../assets/illustrations/myteacher_kenya.png';
import myteacherSouthAfrica from '../assets/illustrations/myteacher_south-africa.png';
import myteacherUsa from '../assets/illustrations/myteacher_usa.png';
import myteacherUnitedKingdom from '../assets/illustrations/myteacher_united-kingdom.png';
import myteacherCanada from '../assets/illustrations/myteacher_canada.png';
import myteacherIndia from '../assets/illustrations/myteacher_india.png';

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
  { key: 'address', label: 'Change Address & Info', icon: 'fa-map-marker-alt' },
  { key: 'country', label: 'Set Date of Birth, State & Country', icon: 'fa-flag' },
  { key: 'userinfo', label: 'User Info (Profile Details)', icon: 'fa-id-card' },
  { key: 'storyImage', label: 'Story Image', icon: 'fa-image' },
  { key: 'storyVideo', label: 'Story Video', icon: 'fa-video' },
  { key: 'profileImage', label: 'Profile Image', icon: 'fa-user-circle' },
];

const Settings = () => {
  const { user, refreshUser, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isExpanded, setIsExpanded] = useState(true);
  const toggleSidebar = () => setIsExpanded(prev => !prev);
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [enable2FA, setEnable2FA] = useState(false);
  const [stateOfOrigin, setStateOfOrigin] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');
  const [aboutYourSelf, setAboutYourSelf] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [marritaStatus, setMarritaStatus] = useState('');
  const [storyImage, setStoryImage] = useState('');
  const [storyVideo, setStoryVideo] = useState('');
  const [userInfoExists, setUserInfoExists] = useState(false);
  const [storyImageFile, setStoryImageFile] = useState(null);
  const [storyVideoFile, setStoryVideoFile] = useState(null);
  const [storyImageUploading, setStoryImageUploading] = useState(false);
  const [storyVideoUploading, setStoryVideoUploading] = useState(false);
  // Modal and spinner state
  const [openSection, setOpenSection] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => { setStateOfOrigin(''); }, [country]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCountry(user.country || '');
      setStateOfOrigin(user.city || '');
      setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.substring(0, 10) : '');
      setAddress(user.address || '');
      setAbout(user.about || ''); // This 'about' is from the main User model
    }
  }, [user]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
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
          // If address is also part of user_info, you might want to set it here too or decide which one takes precedence
          // setAddress(data.address || user.address || ''); 
          setUserInfoExists(true);
        } else {
          setUserInfoExists(false);
        }
      } catch {
        setUserInfoExists(false);
      }
    };
    fetchUserInfo();
  }, [user]); // Re-fetch if user changes, e.g., after login

  useEffect(() => {
    if (!user || !user._id || !PUSHER_KEY || !PUSHER_CLUSTER) return;

    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      forceTLS: true
    });

    const userId = user._id || user.id;

    // Channel for UserInfo specific updates
    const userInfoChannel = pusher.subscribe('user-info');
    userInfoChannel.bind('created', data => {
      if (data.userId === userId && data.userInfo) {
        setAboutYourSelf(data.userInfo.aboutYourSelf || '');
        setHobbies(data.userInfo.hobbies || '');
        setMarritaStatus(data.userInfo.marritaStatus || '');
        // If address is part of userInfo and updated via this event
        if (data.userInfo.address) setAddress(data.userInfo.address);
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

    // Channel for main User model updates
    const userChannel = pusher.subscribe('user');
    userChannel.bind('profile_updated', data => {
      if (data.user && (data.user._id === userId || data.user.id === userId)) {
        updateUser(data.user); // Update context and localStorage
        toast.info('Profile updated (real-time)');
      }
    });
    userChannel.bind('profile_image_updated', data => {
      if (data.user && (data.user._id === userId || data.user.id === userId)) {
        updateUser(data.user);
        toast.info('Profile image updated (real-time)');
      }
    });
    userChannel.bind('course_updated', data => {
      if (data.user && (data.user._id === userId || data.user.id === userId)) {
        updateUser(data.user);
        toast.info('Course updated (real-time)');
      }
    });
    userChannel.bind('deleted', data => { // Listen for account deletion
      if (data.userId === userId) {
        toast.info('Your account was deleted (real-time). Logging out.');
        updateUser(null); // Clear user from context
        // Potentially navigate to login or home page
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
    if (!password) {
      toast.error("New password cannot be empty.");
      setModalLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setModalLoading(false);
      return;
    }
    if (user && user.googleId) {
      toast.error("Password change not allowed for Google-authenticated users.");
      setModalLoading(false);
      return;
    }

    // IMPORTANT: Backend should ideally require current password for security.
    // The provided backend code for /user/profile is NOT suitable for password changes.
    // You need a dedicated, secure endpoint (e.g., /user/change-password).
    // For this example, I'm showing a placeholder.
    // Replace `/user/profile` with your actual secure password change endpoint.
    try {
      const token = localStorage.getItem('token');
      // THIS IS A PLACEHOLDER - USE A DEDICATED SECURE ENDPOINT
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // Your secure endpoint would likely take { currentPassword, newPassword }
        body: JSON.stringify({ password }), // Sending new password
      });
      const data = await res.json();
      if (res.ok) {
        // The backend /user/profile doesn't actually change the password in the provided code.
        // This success message is based on the assumption it would if properly implemented.
        toast.success(data.message || "Password update request sent. (Ensure backend handles this securely)");
        setPassword('');
        setConfirmPassword('');
        setOpenSection(null);
      } else {
        toast.error(data.message || "Failed to update password.");
      }
    } catch (err) {
      toast.error("Network error updating password. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleBasicProfileUpdate = async (e) => {
    e.preventDefault();
    if (user && user.googleId) {
      toast.error("Profile update not allowed for Google-authenticated users.");
      setModalLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Profile updated successfully!");
        if (updateUser && data.user) {
          updateUser(data.user); // This will also trigger the useEffect for user state
        }
        setOpenSection(null);
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (err) {
      toast.error("Network error updating profile. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    if (user && user.googleId) {
      toast.error("Profile update not allowed for Google-authenticated users.");
      setModalLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      // The backend /user/profile handles 'address'.
      // 'about' from the main User model is not explicitly handled by the /user/profile switch in backend.
      // If you want to update user.about, backend needs modification.
      // This 'about' is different from 'aboutYourSelf' in UserInfo.
      const payload = { address };
      // if (about) payload.about = about; // Only include if backend /user/profile handles 'about' for User model

      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Address updated successfully!");
        if (updateUser && data.user) updateUser(data.user);
        setOpenSection(null);
      } else {
        toast.error(data.message || "Failed to update address.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleCountryStateDobUpdate = async (e) => {
    e.preventDefault();
    if (user && user.googleId) {
      toast.error("Profile update not allowed for Google-authenticated users.");
      setModalLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ country, city: stateOfOrigin, dateOfBirth }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Details updated successfully!");
        if (updateUser && data.user) updateUser(data.user);
        setOpenSection(null);
      } else {
        toast.error(data.message || "Failed to update details.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleUserInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = userInfoExists ? 'PATCH' : 'POST';
      // Note: The backend /user_info/me endpoint is not shown in the provided backend code.
      // Assuming it exists and handles these fields.
      // Also, decide if 'address' is part of UserInfo or just User model.
      // If UserInfo also has 'address', include it here.
      const res = await fetch(`${API_BASE}/user_info/me`, {
        method: method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ aboutYourSelf, hobbies, marritaStatus /*, address: address */ }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || `User info ${userInfoExists ? 'updated' : 'created'} successfully!`);
        setUserInfoExists(true);
        // Update local state from response if needed
        if (data.userInfo) {
            setAboutYourSelf(data.userInfo.aboutYourSelf || '');
            setHobbies(data.userInfo.hobbies || '');
            setMarritaStatus(data.userInfo.marritaStatus || '');
            // if (data.userInfo.address) setAddress(data.userInfo.address);
        }
        setOpenSection(null);
      } else {
        toast.error(data.message || "Failed to save user info.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };


  // Modal rendering logic
  const renderModal = () => {
    if (!openSection) return null;
    let content = null;
    switch (openSection) {
      case 'password':
        content = (
          <form className={`input-box-auth ${theme}`} onSubmit={e => {
            e.preventDefault();
            setModalLoading(true);
            handlePasswordUpdate(e); // Removed .finally here as it's inside the handler
          }}>
            <h2>Change Password</h2>
            <input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }} />
            <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }} />
            <button type="submit">Update Password</button>
          </form>
        );
        break;
      case 'profile':
        content = (
          <form className={`input-box-auth ${theme}`} onSubmit={e => {
            e.preventDefault();
            setModalLoading(true);
            handleBasicProfileUpdate(e);
          }}>
            <h2>Change Profile</h2>
            <input type="text" placeholder="New username" value={name} onChange={e => setName(e.target.value)} style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }} />
            <input type="email" placeholder="New email" value={email} onChange={e => setEmail(e.target.value)} style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }} />
            <button type="submit">Update Profile</button>
          </form>
        );
        break;
      case 'address':
        content = (
          <form className={`input-box-auth ${theme}`} onSubmit={e => {
            e.preventDefault();
            setModalLoading(true);
            handleAddressUpdate(e);
          }}>
            <h2>Change Address & info</h2>
            <textarea type="text" placeholder="Change Address" value={address} onChange={e => setAddress(e.target.value)} style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }} />
            {/* This 'about' is for the main User model. Ensure backend /user/profile handles it if uncommented. */}
            {/* <textarea type="text" placeholder="About you (User model)" value={about} onChange={e => setAbout(e.target.value)} /> */}
            <button type="submit">Update Profile</button>
          </form>
        );
        break;
      case 'country':
        content = (
          <form className={`input-box-auth ${theme}`} onSubmit={e => {
            e.preventDefault();
            setModalLoading(true);
            handleCountryStateDobUpdate(e);
          }}>
            <h2>Set Date of Birth, State of Origin & Country</h2>
            <input type="date" placeholder="Date of Birth" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }} />
            <select value={country} onChange={e => setCountry(e.target.value)} style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }}>
              <option value="">Select Country</option>
              {Object.entries(statesByCountry).map(([countryKey]) => (
                <option key={countryKey} value={countryKey}>{countryKey}</option>
              ))}
              <option value="Other">Other</option>
            </select>
            {country && statesByCountry[country]?.flag && (
              <img src={statesByCountry[country].flag} alt={`${country} flag`} style={{ width: 32, height: 20, margin: '8px 0 0 8px', borderRadius: 4, objectFit: 'cover', display: 'inline-block', verticalAlign: 'middle', backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }} />
            )}
            {statesByCountry[country] ? (
              <select value={stateOfOrigin} onChange={e => setStateOfOrigin(e.target.value)} style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }}>
                <option value="">Select State/Region</option>
                {statesByCountry[country].states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            ) : (
              <input type="text" placeholder="State of Origin" value={stateOfOrigin} onChange={e => setStateOfOrigin(e.target.value)} style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }} />
            )}
            <button type="submit">Update Profile</button>
          </form>
        );
        break;
      case 'userinfo':
        content = (
          <form className={`input-box-auth ${theme}`} onSubmit={e => {
            e.preventDefault();
            setModalLoading(true);
            handleUserInfoSubmit(e);
          }}>
            <h2>User Info (Profile Details)</h2>
            <textarea placeholder="About Yourself" value={aboutYourSelf} onChange={e => setAboutYourSelf(e.target.value)} style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }} />
            <input type="text" placeholder="Hobbies (comma separated)" value={hobbies} onChange={e => setHobbies(e.target.value)} style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }} />
            <input type="text" placeholder="Marital Status" value={marritaStatus} onChange={e => setMarritaStatus(e.target.value)} style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }} />
            <button type="submit">{userInfoExists ? 'Update User Info' : 'Create User Info'}</button>
          </form>
        );
        break;
      case 'storyImage':
        content = (
          <form className={`input-box-auth ${theme}`} onSubmit={async e => {
            e.preventDefault();
            if (!storyImageFile) return toast.warning('Please select an image.');
            setModalLoading(true);
            setStoryImageUploading(true);
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('storyImage', storyImageFile);
            try {
              // Assuming /user_info/upload/storyImage exists and handles this
              const res = await fetch(`${API_BASE}/user_info/upload/storyImage`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
              });
              const data = await res.json();
              if (res.ok) {
                setStoryImage(data.url); // Update local state for preview
                toast.success('Story image uploaded!');
                // Pusher event should update other clients if needed
              } else {
                toast.error(data.message || 'Story image upload failed');
              }
            } catch {
              toast.error('Story image upload failed');
            } finally {
              setStoryImageUploading(false);
              setModalLoading(false);
            }
          }}>
            <h2>Story Image</h2>
            <div className="fb-upload-preview" style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }}>
              {storyImage && (<img src={storyImage} alt="Story" />)}
            </div>
            <label className="fb-file-upload-label">
              <i className="fas fa-camera fb-file-upload-icon"></i>
              <input type="file" accept="image/*" onChange={e => setStoryImageFile(e.target.files[0])} style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }} />
            </label>
            <button type="submit" disabled={storyImageUploading}>{storyImageUploading ? 'Uploading...' : 'Upload Story Image'}</button>
          </form>
        );
        break;
      case 'storyVideo':
        content = (
          <form className={`input-box-auth ${theme}`} onSubmit={async e => {
            e.preventDefault();
            if (!storyVideoFile) return toast.warning('Please select a video.');
            setModalLoading(true);
            setStoryVideoUploading(true);
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('storyVideo', storyVideoFile);
            try {
              // Assuming /user_info/upload/storyVideo exists
              const res = await fetch(`${API_BASE}/user_info/upload/storyVideo`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
              });
              const data = await res.json();
              if (res.ok) {
                setStoryVideo(data.url); // Update local state for preview
                toast.success('Story video uploaded!');
              } else {
                toast.error(data.message || 'Story video upload failed');
              }
            } catch {
              toast.error('Story video upload failed');
            } finally {
              setStoryVideoUploading(false);
              setModalLoading(false);
            }
          }}>
            <h2>Story Video</h2>
            <div className="fb-upload-preview" style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }}>
              {storyVideo && (<video src={storyVideo} controls />)}
            </div>
            <label className="fb-file-upload-label">
              <i className="fas fa-video fb-file-upload-icon"></i>
              <input type="file" accept="video/*" onChange={e => setStoryVideoFile(e.target.files[0])} style={{ backgroundColor: theme === 'dark' ? '#3b3b3b' : '#fff' }} />
            </label>
            <button type="submit" disabled={storyVideoUploading}>{storyVideoUploading ? 'Uploading...' : 'Upload Story Video'}</button>
          </form>
        );
        break;
      case 'profileImage':
      content = (
      <form className={`input-box-auth ${theme}`} onSubmit={async e => {
        e.preventDefault();
        if (user && user.googleId) {
          toast.error("Profile image update not allowed for Google-authenticated users.");
          setModalLoading(false);
          return;
        }
        if (!profileImage) return toast.warning('Please select an image.');
        setModalLoading(true);
        const token = localStorage.getItem('token');
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = reader.result.split(',')[1];
          const filename = profileImage.name;
          const mimetype = profileImage.type;
          try {
            const res = await fetch(`${API_BASE}/user/profile_image`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                imageBase64: base64,
                filename,
                mimetype
              })
            });
            const data = await res.json();
            if (res.ok) {
              toast.success('Profile image updated!');
              setPreviewImage(null); // Clear preview
              if (updateUser && data.user) {
                updateUser(data.user); // This will trigger Pusher event from backend if configured
              }
              setOpenSection(null);
            } else {
              toast.error(data.message || 'Upload failed!');
            }
          } catch(err) {
            toast.error('Upload failed! ' + err.message);
          } finally {
            setModalLoading(false);
          }
        };
        reader.readAsDataURL(profileImage);
      }}>
      <h2 style={{ textAlign: 'center' }}>Profile Image</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div className="profile-img-container">
      {(() => {
      const imgSrc = previewImage
      ? previewImage
      : (user && user.avatar && typeof user.avatar === 'string' && user.avatar.startsWith('http'))
      ? user.avatar
      : userAvatarDefault;
      return (
      <Img
      src={imgSrc}
      alt="profile"
      className="preview-avatar"
      style={{
      maxWidth: 120,
      maxHeight: 120,
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #ccc',
      background: theme === 'dark' ? '#23272f' : '#fff'
      }}
      loader={<span>Loading...</span>}
      unloader={<img src={userAvatarDefault} alt="profile" className="preview-avatar" style={{ maxWidth: 120, maxHeight: 120, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ccc', background: theme === 'dark' ? '#23272f' : '#fff' }} />}
      />
      );
      })()}
      <label className="fb-file-upload-label">
      <i className="fas fa-camera fb-file-upload-icon" />
      <input type="file" accept="image/*,.avif" onChange={e => {
      const file = e.target.files[0];
      if (file) {
        // Basic client-side validation for allowed types (backend does the robust check)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/avif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Only JPG, PNG, or AVIF images are allowed.');
            return;
        }
        setProfileImage(file);
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      }
      }} />
      </label>
      </div>
      <button type="submit" style={{ width: '100%', maxWidth: 200, alignSelf: 'center' }}>
      Upload Profile Image
      </button>
      </div>
      </form>
      );
      break;
      default:
        content = null;
    }
    return (
      <div className="settings-modal-overlay">
        <div className="settings-modal">
          <button 
            className="modal-close" 
            onClick={() => setOpenSection(null)}
            aria-label="Close modal"
          >
            <i className="fas fa-xmark"></i>
          </button>
          {modalLoading && (
            <div className="modal-spinner-overlay"><div className="modal-spinner"></div></div>
          )}
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className={`dashboard-container ${theme}`}>
    <DashMobileNav theme={theme} />
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    <div className={`sidebar${isExpanded ? '' : ' collapsed'}`}>
    <button onClick={toggleSidebar} className="toggle-button">
    <i className={`fas ${isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
    </button>
    <nav className="nav">
    <FullscreenIcon />
    <NavItem icon="home" label="Home" move="/" isExpanded={isExpanded} />
    <NavItem icon="chart-bar" label="Dashboard" move="/dashboard" isExpanded={isExpanded} />
    <NavItem icon="user" label="Profile" move="/profile" isExpanded={isExpanded} />
    <NavItem icon="chalkboard-teacher" label="Online Class" move="/online-class" isExpanded={isExpanded} />
    <NavItem icon="briefcase" label="Assets" move="/assets" isExpanded={isExpanded} />
    <NavItem icon="cog" label="Settings" move="/settings" isExpanded={isExpanded} />
    <NavItem icon="question-circle" label="Help" move="/help" isExpanded={isExpanded} />
    <NavItem icon="right-from-bracket" label="Log Out" move="" isExpanded={isExpanded} onClick={logout} />
    </nav>
    </div>
    <div className="settings-content">
    <h1>⚙️ Account Settings</h1>
    <button onClick={toggleTheme} className="theme-toggle"
    style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000, padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0', color: theme === 'dark' ? '#fff' : '#000', display: 'flex', alignItems: 'center' }}>
    <i className={`fas fa-${theme === 'light' ? 'moon' : 'sun'}`} />
    </button>
    <div className="setting-input-section">
    {SECTION_LIST.map(section => (
    <div
    key={section.key}
    className={`settings-card ${theme}${openSection === section.key ? ' open' : ''}`}
    style={{
      backgroundColor: theme === 'dark' ? '#2c2f33' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000',
    }}
    onClick={() => {
        // For profile image, if user is google authenticated, show toast and don't open modal
        if (section.key === 'profileImage' && user && user.googleId) {
            toast.error("Profile image update not allowed for Google-authenticated users.");
            return;
        }
         if (section.key === 'password' && user && user.googleId) {
            toast.error("Password change not allowed for Google-authenticated users.");
            return;
        }
        // For other profile sections, if user is google authenticated, show toast and don't open modal
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
    </div>
    </div>
  );
};

const NavItem = ({ icon, label, isExpanded, move, onClick }) => (
  <Link className="nav-item" to={move || "#"} onClick={onClick}> {/* Added fallback for move */}
    <i className={`fas fa-${icon}`} style={{ fontSize: '20px', marginRight: isExpanded ? '10px' : '0' }}></i>
    {isExpanded && <span>{label}</span>}
  </Link>
);

export default Settings;
