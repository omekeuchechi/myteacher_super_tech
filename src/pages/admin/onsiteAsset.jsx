import React, { useState, useEffect, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../../../context/Authcontext';
import { CourseContext } from '../../../context/CourseContext';
import AdminNav from '../../components/adminCom/navSection';
import '../../assets/styles/admin/onsiteAsset.css';

const API_BASE = import.meta.env.VITE_BASEURL;

const OnsiteAsset = () => {
  const { user, logout } = useContext(AuthContext);
  const { courses } = useContext(CourseContext);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [folderName, setFolderName] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch assets when course selection changes
  const fetchAssets = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/onsite-assets/list/${selectedCourse}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setAssets(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch assets');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [selectedCourse]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'image/svg+xml': ['.svg']
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles);
    }
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedCourse || files.length === 0) {
      setError('Please select a course and at least one file');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      files.forEach(file => {
        formData.append('file', file);
      });
      
      // Add folder name to form data if provided
      if (folderName) {
        formData.append('folder', folderName);
      }

      const res = await fetch(
        `${API_BASE}/onsite-assets/upload?courseId=${selectedCourse}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        setSuccess('File uploaded successfully');
        setFiles([]);
        setFolderName(''); // Reset folder name after successful upload
        fetchAssets();
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (assetId) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/onsite-assets/${assetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccess('Asset deleted successfully');
        fetchAssets();
      } else {
        throw new Error(data.message || 'Delete failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete asset');
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/admin/onsite-assets", label: "Onsite Assets" }
  ];

  return (
    <>
      <AdminNav navLinks={navLinks} onLogout={logout} />
      <div className="onsiteContainer">
        <h1 className="header">Course Assets</h1>
        
        <div className="uploadSection">
          <h2 className="sectionTitle">Upload New Asset</h2>
          
          <div className="selectContainer">
            <label className="selectLabel">Select Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="selectInput"
              disabled={uploading}
            >
              <option value="">-- Select a course --</option>
              {courses?.map(course => (
                <option key={course._id} value={course._id}>
                  {course.course}
                </option>
              ))}
            </select>
          </div>

          <div className="inputContainer">
            <label className="selectLabel">Folder Name (Optional):</label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="selectInput"
              placeholder="Enter a folder name (optional)"
              disabled={uploading}
            />
          </div>

          <div
            {...getRootProps()}
            className="dropzone"
          >
            <input {...getInputProps()} />
            <p className="dropzoneText">Drag 'n' drop files here, or click to select files</p>
            {files.length > 0 && (
              <p className="fileCount">
                {files.length} file(s) selected
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || !selectedCourse || files.length === 0}
            className="uploadButton"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        <div>
          <h2 className="sectionTitle">Uploaded Assets</h2>
          {error && <div className="errorMessage">{error}</div>}
          {success && <div className="successMessage">{success}</div>}
          
          {loading ? (
            <p className="loadingText">Loading...</p>
          ) : (
            <div className="assetsGrid">
              {assets.map(asset => (
                <div key={asset._id} className="assetCard">
                  <div className="assetName">{asset.name}</div>
                  <div className="assetMeta">
                    <span>Course: {asset.courseId?.name || 'N/A'}</span>
                    <span>Uploaded: {new Date(asset.createdAt).toLocaleDateString()}</span>
                    <span>By: {asset.uploadedBy?.name || 'Unknown'}</span>
                  </div>
                  <div className="assetActions">
                    <a
                      href={asset.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="actionButton"
                    >
                      View
                    </a>
                    {(user?.isAdmin || user?.isSuperAdmin || user?._id === asset.uploadedBy?._id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(asset._id);
                        }}
                        className="actionButton deleteButton"
                        disabled={uploading}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {assets.length === 0 && !loading && (
                <div className="emptyState">
                  No assets found for the selected course.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OnsiteAsset;