import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/dashboard/setting.css';
import DashMobileNav from '../components/userDashCom/dashMobileNav';
import FullscreenIcon from '../components/userDashCom/fullscreenIcon';

import profileImgDefault from '../assets/illustrations/user_profile.png';

// All supported countries and their states/provinces/regions
const statesByCountry = {
  Nigeria: [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
    "Taraba", "Yobe", "Zamfara"
  ],
  Ghana: [
    "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra",
    "North East", "Northern", "Oti", "Savannah", "Upper East", "Upper West", "Volta",
    "Western", "Western North"
  ],
  Kenya: [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa", "Homa Bay",
    "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii",
    "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera",
    "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi",
    "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita Taveta", "Tana River",
    "Tharaka Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
  ],
  "South Africa": [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga",
    "Northern Cape", "North West", "Western Cape"
  ],
  "United States": [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
  ],
  "United Kingdom": [
    "England", "Northern Ireland", "Scotland", "Wales"
  ],
  Canada: [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
    "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
    "Quebec", "Saskatchewan", "Yukon"
  ],
  India: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
  ]
  // Add more countries and their states if needed
};

const Settings = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isExpanded, setIsExpanded] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [enable2FA, setEnable2FA] = useState(false);
  const [stateOfOrigin, setStateOfOrigin] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Reset state of origin when country changes
  useEffect(() => {
    setStateOfOrigin('');
  }, [country]);

  const toggleSidebar = () => setIsExpanded(prev => !prev);
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const handlePasswordUpdate = async () => {
    if (password.length < 6) return toast.error('Password must be at least 6 characters.');
    if (password !== confirmPassword) return toast.error('Passwords do not match.');

    try {
      await fetch('/api/update-password', {
        method: 'POST',
        body: JSON.stringify({ password }),
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Failed to update password.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageUpload = async () => {
    if (!profileImage) return toast.warning('Please select an image.');

    const formData = new FormData();
    formData.append('avatar', profileImage);

    try {
      await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });
      toast.success('Profile image updated!');
    } catch (error) {
      toast.error('Upload failed!');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action is permanent.')) return;

    try {
      await fetch('/api/delete-account', { method: 'DELETE' });
      toast.success('Account deleted. Redirecting...');
      setTimeout(() => navigate('/goodbye'), 3000);
    } catch (error) {
      toast.error('Failed to delete account.');
    }
  };

  const handle2FAToggle = async () => {
    setEnable2FA(prev => !prev);
    try {
      await fetch('/api/2fa-toggle', {
        method: 'POST',
        body: JSON.stringify({ enable: !enable2FA }),
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success(`2FA ${!enable2FA ? 'enabled' : 'disabled'}`);
    } catch {
      toast.error('Failed to update 2FA settings');
    }
  };

  return (
    <div className={`settings-page ${theme}`}>
      <DashMobileNav theme={theme} />
      <ToastContainer position="top-right" />

      {/* Sidebar with collapsible toggle and FullscreenIcon */}
      <div className={`sidebar ${theme} nav-item-hide ${isExpanded ? '' : 'collapsed'}`}>
        <button onClick={toggleSidebar} className="toggle-button">
          <i className={`fas ${isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
        </button>

        <nav className={`nav ${theme}`}>
          {/* Fullscreen toggle button */}
          <FullscreenIcon />

          {/* Navigation items */}
          <NavItem icon="home" label="Home" move="/" isExpanded={isExpanded} />
          <NavItem icon="chart-bar" label="Dashboard" move="/dashboard" isExpanded={isExpanded} />
          <NavItem icon="chalkboard-teacher" label="Online Class" move="/online-class" isExpanded={isExpanded} />
          <NavItem icon="briefcase" label="Assets" move="/assets" isExpanded={isExpanded} />
          <NavItem icon="cog" label="Settings" move="/settings" isExpanded={isExpanded} />
          <NavItem icon="question-circle" label="Help" move="/help" isExpanded={isExpanded} />
          <NavItem icon="right-from-bracket" label="Log Out" move="/logout" isExpanded={isExpanded} />
        </nav>
      </div>

      {/* Main Settings Content */}
      <div className="settings-content">
        <h1>⚙️ Account Settings</h1>

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="theme-toggle" 
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '8px 12px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: theme ? '#333' : '#f0f0f0',
          color: theme ? '#fff' : '#000',
          display: 'flex',
          alignItems: 'center',
        }}
        >
          <i className={`fas fa-${theme === 'light' ? 'moon' : 'sun'}`} />
        </button>

        <div className="setting-input-section">

        {/* Change Password */}
        <section className={`input-box-auth ${theme}`}>
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
          <button onClick={handlePasswordUpdate}>Update Password</button>
        </section>

        <section className={`input-box-auth ${theme}`}>
          <h2>Change Profile</h2>
          <input
            type="text"
            placeholder="New username"
          />
          <input
            type="email"
            placeholder="New email"
          />
          <button>Update Profile</button>
        </section>

        <section className={`input-box-auth ${theme}`}>
          <h2>Change Address & info</h2>
          <textarea
            type="text"
            placeholder="Change Address"
          />
          <textarea
            type="text"
            placeholder="About you"
          />
          <button>Update Profile</button>
        </section>
        <section className={`input-box-auth ${theme}`}>
          <h2>Set Date of Birth, State of Origin & Country</h2>
          <input
            type="date"
            placeholder="Date of Birth"
          />
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '6px', width: '100%' }}
          >
            <option value="">Select Country</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Ghana">Ghana</option>
            <option value="Kenya">Kenya</option>
            <option value="South Africa">South Africa</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="India">India</option>
            <option value="Other">Other</option>
          </select>
          {/* Show state select if country is in the list, else show text input */}
          {statesByCountry[country] ? (
            <select
              value={stateOfOrigin}
              onChange={e => setStateOfOrigin(e.target.value)}
              style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '6px', width: '100%' }}
            >
              <option value="">Select State/Region</option>
              {statesByCountry[country].map(state => (
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
          <button>Update Profile</button>
        </section>

        {/* Profile Image Upload */}
        <section className={`input-box-auth ${theme}`}>
          <h2 style={{ textAlign: 'center' }}>Profile Image</h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative', width: 120, height: 120 }}>
              <img
                src={previewImage || profileImgDefault}
                alt="profile"
                className="preview-avatar"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: `3px solid ${theme === 'dark' ? '#4a90e2' : '#357ab9'}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  background: theme === 'dark' ? '#222' : '#fff',
                }}
              />
              <label
                htmlFor="profile-image-upload"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: theme === 'dark' ? '#222' : '#fff',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${theme === 'dark' ? '#4a90e2' : '#357ab9'}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                  cursor: 'pointer',
                }}
              >
                <i className="fas fa-camera" style={{ fontSize: 20, color: theme === 'dark' ? '#4a90e2' : '#357ab9' }} />
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    display: 'none'
                  }}
                />
              </label>
            </div>
            <button
              onClick={handleProfileImageUpload}
              style={{
                width: '100%',
                maxWidth: 200,
                alignSelf: 'center'
              }}
            >
              Upload Profile Image
            </button>
          </div>
        </section>

        {/* Two-Factor Authentication */}
        {/* <section>
          <h2>Two-Factor Authentication</h2>
          <label>
            <input
              type="checkbox"
              checked={enable2FA}
              onChange={handle2FAToggle}
            />
            Enable 2FA
          </label>
        </section> */}

        {/* Delete Account */}
        {/* <section>
          <h2>Danger Zone</h2>
          <button onClick={handleDeleteAccount} className="danger-btn">
            Delete My Account
          </button>
        </section> */}
        </div>
      </div>
    </div>
  );
};

// Inline NavItem helper component
const NavItem = ({ icon, label, isExpanded, move }) => (
  <Link className="nav-item" to={move}>
    <i className={`fas fa-${icon}`} style={{ fontSize: '20px', marginRight: isExpanded ? '10px' : '0' }}></i>
    {isExpanded && <span>{label}</span>}
  </Link>
);

export default Settings;