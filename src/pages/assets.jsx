import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/Authcontext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../assets/styles/dashboard/UserDashboard.css';
import '../assets/styles/dashboard/assets.css';
import DashMobileNav from '../components/userDashCom/dashMobileNav';
import FullscreenIcon from "../components/userDashCom/fullscreenIcon";
import { Link } from "react-router-dom";
import Header from '../components/userDashCom/header';
import myteacherLogo from '../img/Untitled-1.png';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

function Assets() {
  const { user, logout } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newAsset, setNewAsset] = useState({ file: null, zipName: "" });
  const [uploading, setUploading] = useState(false);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState("");
  const [fetchingLectures, setFetchingLectures] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch assets from backend
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/assets/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setAssets(data);
      } catch (err) {
        // handle error
      }
    };
    fetchAssets();
  }, []);

  // Fetch user's lectures for upload selection
  useEffect(() => {
    if (!showAdd) return;
    setFetchingLectures(true);
    const fetchLectures = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/lecture/userSpecificLecture`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data.lectures)) {
          setLectures(data.lectures);
        } else {
          setLectures([]);
        }
      } catch {
        setLectures([]);
      }
      setFetchingLectures(false);
    };
    fetchLectures();
  }, [showAdd]);

  // Theme
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleSidebar = () => setIsExpanded(prev => !prev);
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const isLightMode = theme === 'light';

  // Handle file input
  const handleFileChange = (e) => {
    setNewAsset({ ...newAsset, file: e.target.files[0] });
    if (e.target.files[0] && !newAsset.zipName) {
      // Default zip name to file name (without extension)
      const name = e.target.files[0].name.replace(/\.[^/.]+$/, "");
      setNewAsset(prev => ({ ...prev, zipName: name }));
    }
  };

  // Handle zip name input
  const handleZipNameChange = (e) => {
    setNewAsset({ ...newAsset, zipName: e.target.value });
  };

  

  // Download asset from backend
  const handleDownload = async (asset) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/assets/download/${asset._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = asset.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download failed");
    }
  };

  // Filtered assets
  const filteredAssets = assets.filter(asset =>
    asset.name && asset.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`dashboard-container ${theme}`}>
      <Header theme={theme} />
      <DashMobileNav theme={theme} />
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed', top: '10px', right: '10px', zIndex: 1000,
          padding: '8px 12px', border: 'none', borderRadius: '4px',
          cursor: 'pointer', backgroundColor: isLightMode ? '#333' : '#f0f0f0',
          color: isLightMode ? '#fff' : '#000', display: 'flex', alignItems: 'center',
        }}
      >
        <i className={`fas fa-${isLightMode ? 'moon' : 'sun'}`} style={{ marginRight: '8px', fontSize: '16px' }}></i>
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isExpanded ? '' : 'collapsed'}`}>
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
          <NavItem icon="book" label="Assignment" move="/assignment" isExpanded={isExpanded} />
          <NavItem icon="cog" label="Settings" move="/settings" isExpanded={isExpanded} />
          <NavItem icon="question-circle" label="Help" move="/help" isExpanded={isExpanded} />
          <NavItem icon="right-from-bracket" label="Log Out" move="/logout" isExpanded={isExpanded} onClick={logout} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 style={{ margin: "40px 0 20px 0" }}>💼 Assets</h1>
        <div className="assets-panel">
          <div className="assets-panel-header">
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="assets-search"
            />
          </div>

          {/* Asset Table */}
          <div className={`assets-table-wrap ${theme}`}>
            <div className={`assets-table ${theme}`}>
              {/* Header Row */}
              <div className={`assets-table-header ${theme}`}>
                <div className={`assets-table-row ${theme}`}>
                  <div className={`assets-table-cell ${theme}`}>#</div>
                  <div className={`assets-table-cell ${theme}`}>Name</div>
                  <div className={`assets-table-cell ${theme}`}>Type</div>
                  <div className={`assets-table-cell ${theme}`}>Uploader</div>
                  <div className={`assets-table-cell ${theme}`}>Action</div>
                </div>
              </div>
              
              {/* Table Body */}
              <div className={`assets-table-body ${theme}`}>
                {filteredAssets.length === 0 ? (
                  <div className={`assets-table-row no-results ${theme}`}>
                    <div className={`assets-table-cell ${theme}`} style={{ gridColumn: '1 / -1' }}>
                      No assets found.
                    </div>
                  </div>
                ) : (
                  filteredAssets
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((asset, idx) => (
                    <div 
                      className={`assets-table-row ${theme}`} 
                      key={asset._id}
                      onClick={() => {
                        setSelectedAsset(asset);
                        setShowModal(true);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={`assets-table-cell ${theme}`}>{idx + 1}</div>
                      <div className={`assets-table-cell ${theme}`}>{asset.name}</div>
                      <div className={`assets-table-cell ${theme}`}>{asset.mimeType}</div>
                      <div className={`assets-table-cell ${theme}`}>{asset.uploadedBy?.name || "Unknown"}</div>
                      <div className={`assets-table-cell ${theme}`}>
                        <button
                          className={`assets-action-btn ${theme}`}
                          onClick={() => handleDownload(asset)}
                          title="Download"
                        >
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Asset Details Modal */}
      {showModal && selectedAsset && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className={`modal-content ${theme}`} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Asset Details</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="asset-detail">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedAsset.name}</span>
              </div>
              <div className="asset-detail">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{selectedAsset.mimeType}</span>
              </div>
              <div className="asset-detail">
                <span className="detail-label">Uploaded By:</span>
                <span className="detail-value">{selectedAsset.uploadedBy?.name || "Unknown"}</span>
              </div>
              <div className="asset-detail">
                <span className="detail-label">Uploaded At:</span>
                <span className="detail-value">
                  {new Date(selectedAsset.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="modal-actions">
                <button 
                  className={`download-btn ${theme}`}
                  onClick={() => {
                    handleDownload(selectedAsset);
                    setShowModal(false);
                  }}
                >
                  <i className="fas fa-download"></i> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: var(--bg-color, #fff);
          padding: 20px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--text-color, #333);
        }
        
        .asset-detail {
          margin: 15px 0;
          display: flex;
          flex-direction: column;
        }
        
        .detail-label {
          font-weight: bold;
          margin-bottom: 5px;
          font-size: 15px;
          color: var(--text-color, #333);
        }
        
        .detail-value {
          font-size: 15px;
          color: var(--text-color, #666);
          word-break: break-all;
        }
        
        .modal-actions {
          margin-top: 25px;
          display: flex;
          justify-content: flex-end;
        }
        
        .download-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          background-color: #4CAF50;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .download-btn.light {
          background-color: #2E7D32;
        }
        
        .download-btn:hover {
          opacity: 0.9;
        }
        
        .dark .modal-content {
          --bg-color: #2d2d2d;
          --text-color: #f0f0f0;
        }
        
        .light .modal-content {
          --bg-color: #ffffff;
          --text-color: #333333;
        }`}
      </style>
    </div>
  );
}

function NavItem({ icon, label, isExpanded, move, onClick }) {
  return (
    <Link className="nav-item" to={move} onClick={onClick}>
      <i
        className={`fas fa-${icon}`}
        style={{
          fontSize: '22px',
          marginRight: isExpanded ? '12px' : '0',
        }}
      ></i>
      {isExpanded && <span style={{ fontSize: '16px' }}>{label}</span>}
    </Link>
  );
}

export default Assets;