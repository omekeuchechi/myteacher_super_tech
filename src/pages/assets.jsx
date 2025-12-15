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
import Sidebar from '../components/common/Sidebar';

const API_BASE = import.meta.env.VITE_BASEURL;

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch assets from backend
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        // console.log('LocalStorage contents:', { ...localStorage });

        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = userData?._id;

        // console.log('Auth values:', { token, userId });

        if (!token || !userId) {
          console.error('Authentication token or user ID not found in localStorage');
          return;
        }

        // First, get the user's enrolled lectures
        console.log('Fetching user lectures...');
        const lecturesResponse = await fetch(`${API_BASE}/lectures/userSpecificLecture`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        const lecturesData = await lecturesResponse.json();

        if (!lecturesResponse.ok) {
          throw new Error(lecturesData.message || 'Failed to fetch user lectures');
        }

        // Extract lecture IDs from the response
        const lectureIds = lecturesData.lectures?.map(lecture => lecture._id) || [];

        if (lectureIds.length === 0) {
          console.log('No lectures found for user');
          setAssets([]);
          return;
        }

        // console.log('Found lectures:', lectureIds);

        // Get assets for these lectures
        const assetsPromises = lectureIds.map(lectureId =>
          fetch(`${API_BASE}/assets/list/lecture/${lectureId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
            credentials: 'include'
          })
            .then(res => res.json())
            .then(data =>
              (data.data || []).map(asset => ({
                ...asset,
                id: asset._id || asset.id,
                lecture: {
                  id: lectureId,
                  title: lecturesData.lectures.find(l => l._id === lectureId)?.title || 'Unknown Lecture'
                }
              }))
            )
            .catch(error => {
              console.error(`Error fetching assets for lecture ${lectureId}:`, error);
              return [];
            })
        );

        const assetsArrays = await Promise.all(assetsPromises);
        const allAssets = assetsArrays.flat();

        // console.log('All assets:', allAssets);
        setAssets(allAssets);

      } catch (err) {
        console.error('Error in fetchAssets:', {
          message: err.message,
          name: err.name,
          stack: err.stack
        });
        setAssets([]);
      } finally {
        setIsLoading(false);
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
        console.log('Fetching lectures for upload...');
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/lectures/userSpecificLecture`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch lectures');
        }

        const data = await res.json();
        console.log('Fetched lectures:', data);

        if (data.lectures && Array.isArray(data.lectures)) {
          setLectures(data.lectures);
        } else {
          console.warn('Unexpected lectures data format:', data);
          setLectures([]);
        }
      } catch (error) {
        console.error('Error fetching lectures:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        setLectures([]);
      } finally {
        setFetchingLectures(false);
      }
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
    // Validate input
    if (!asset?.id) {
      setError('Cannot download: Invalid asset data');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to download files');
      return;
    }

    // Set loading state
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Check if this is a folder or a zip file with images
      const isZipFile = asset.name?.toLowerCase().endsWith('.zip') ||
        asset.mimeType === 'application/zip' ||
        (asset.downloadUrl || asset.url)?.toLowerCase().includes('.zip');

      const isImageFile = asset.name?.match(/\.(png|jpg|jpeg|gif|webp|bmp)$/i) ||
        asset.mimeType?.startsWith('image/');

      // Method 1: Check for direct URL first
      const directUrl = asset.downloadUrl || asset.url;
      if (directUrl) {
        if (isZipFile) {
          // For ZIP files, force download with proper extension
          try {
            const response = await fetch(directUrl, {
              headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Ensure .zip extension
            const filename = asset.name.endsWith('.zip') ? asset.name : `${asset.name}.zip`;
            link.download = filename;

            document.body.appendChild(link);
            link.click();

            // Cleanup
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
              document.body.removeChild(link);
            }, 100);

          } catch (error) {
            // Fallback to opening in new tab
            window.open(directUrl, '_blank', 'noopener,noreferrer');
          }
        } else if (isImageFile) {
          // For images, open in new tab for viewing
          window.open(directUrl, '_blank', 'noopener,noreferrer');
        } else {
          // For other files, use standard download
          const link = document.createElement('a');
          link.href = directUrl;
          link.download = asset.name || 'download';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        setSuccess('Download started' + (isZipFile ? ' as ZIP' : isImageFile ? ' in new tab' : ''));
        return;
      }

      // Method 2: Fetch asset details
      const response = await fetch(`${API_BASE}/assets/${asset.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const assetData = result?.data || result;

      // Get the best available URL for download
      const downloadUrl = assetData.webViewLink || assetData.webContentLink ||
        assetData.downloadUrl || assetData.url;

      if (downloadUrl) {
        window.open(downloadUrl, '_blank', 'noopener,noreferrer');
        setSuccess('Download started in new tab');
        return;
      }

      // Method 3: Use download endpoint for binary files
      const downloadResponse = await fetch(`${API_BASE}/assets/download/${asset.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/octet-stream'
        },
        credentials: 'include'
      });

      if (!downloadResponse.ok) {
        const errorData = await downloadResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to download file');
      }

      // Get filename from headers or use asset name
      const contentDisposition = downloadResponse.headers.get('content-disposition');
      let filename = asset.name || `asset-${asset.id}`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i) ||
          contentDisposition.match(/filename=['"]?([^'"]+)/i);
        if (filenameMatch?.[1]) {
          filename = decodeURIComponent(filenameMatch[1].trim());
        }
      }

      // Ensure proper file extension
      if (!filename.includes('.')) {
        const ext = asset.mimeType?.split('/')[1] || 'bin';
        filename = `${filename}.${ext}`;
      }

      // Handle the download
      const blob = await downloadResponse.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
        setSuccess(`Downloaded: ${filename}`);
      }, 100);

    } catch (error) {
      setError(`Download failed: ${error.message || 'Unknown error'}`);

      // Last resort: Try to open any available URL in a new tab
      if (asset.url) {
        window.open(asset.url, '_blank', 'noopener,noreferrer');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered assets
  const filteredAssets = (Array.isArray(assets) ? assets : []).filter(asset =>
    asset && asset.name && asset.name.toLowerCase().includes(search.toLowerCase())
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

      <Sidebar
        isExpanded={isExpanded}
        onToggle={toggleSidebar}
        onLogout={logout}
        showFullscreenIcon={true}
      />

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
                {isLoading ? (
                  <div className="loading-spinner-container">
                    <div className="loading-spinner"></div>
                  </div>
                ) : filteredAssets.length === 0 ? (
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
                        key={asset.id}
                        onClick={() => {
                          setSelectedAsset(asset);
                          setShowModal(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={`assets-table-cell ${theme}`}>{idx + 1}</div>
                        <div className={`assets-table-cell ${theme}`}>{asset.name}</div>
                        <div className={`assets-table-cell ${theme}`}>{asset.mimeType}</div>
                        <div className={`assets-table-cell ${theme}`}>
                          {typeof asset.uploadedBy === 'object' ? asset.uploadedBy.name : asset.uploadedBy || 'Unknown'}
                        </div>
                        <div className={`assets-table-cell ${theme}`}>
                          <button
                            className={`assets-action-btn ${theme}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(asset);
                            }}
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
                <span className="detail-value">
                  {typeof selectedAsset.uploadedBy === 'object'
                    ? selectedAsset.uploadedBy.name
                    : selectedAsset.uploadedBy || 'Unknown'}
                </span>
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

      <style>{`
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
        }
        
        .loading-spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          min-height: 100px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: #3498db;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
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