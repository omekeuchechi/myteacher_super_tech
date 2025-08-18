import React, { useState, useEffect, useContext, useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import { fromEvent } from 'file-selector';
import AdminNav from "../../components/adminCom/navSection";
import { AuthContext } from "../../../context/Authcontext";

const API_BASE = import.meta.env.VITE_BASEURL;

// Helper: fetch with auth
const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };
  
  // Don't set Content-Type for FormData, let the browser set it with the correct boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
};

// Helper: decode JWT to get user info
function getCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return {};
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload._id, isAdmin: payload.isAdmin };
  } catch {
    return {};
  }
}

const PublishAsset = () => {
  const { logout } = useContext(AuthContext);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState("");
  const [zipName, setZipName] = useState("");
  const [files, setFiles] = useState([]);
  const [isFolderUpload, setIsFolderUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [currentUser, setCurrentUser] = useState({});

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      setError("Some files were rejected. Please check file types.");
      return;
    }

    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
      // If more than one file or a directory is detected, treat as folder upload
      const isFolder = acceptedFiles.length > 1 || 
                      (acceptedFiles[0].path && acceptedFiles[0].path.includes('/'));
      setIsFolderUpload(isFolder);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    getFilesFromEvent: (event) => fromEvent(event, { extractFilePaths: true }),
    directory: true, // Enable folder uploads
    noClick: false,
    noKeyboard: true,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'text/plain': ['.txt'],
      'application/rtf': ['.rtf'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'video/*': ['.mp4', '.webm', '.mov', '.avi', '.wmv', '.3gp'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.aac']
    },
    multiple: true
  });

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE}/lectures/lectures`);
        const data = await res.json();
        console.log('Fetched lectures:', data);
        if (res.ok && Array.isArray(data.lectures)) {
          setLectures(data.lectures);
        } else {
          console.error('Unexpected lectures response format:', data);
        }
      } catch (err) {
        console.error('Error fetching lectures:', err);
      }
    };
    fetchLectures();
  }, []);

  const fetchAssets = async () => {
    setLoadingAssets(true);
    setError("");
    try {
      const res = await fetchWithAuth(`${API_BASE}/assets/all`);
      const data = await res.json();
      
      console.log('Raw assets response:', JSON.stringify(data, null, 2));
      
      if (res.ok) {
        let assetsData = [];
        if (data.success && Array.isArray(data.data)) {
          assetsData = data.data;
        } else if (Array.isArray(data)) {
          // Fallback for backward compatibility
          assetsData = data;
        } else {
          console.error('Unexpected response format:', data);
          setError('Failed to load assets: Invalid response format');
          setAssets([]);
          return;
        }
        
        console.log('Processed assets data:', JSON.stringify(assetsData, null, 2));
        console.log('Available lecture IDs:', lectures.map(l => l._id));
        
        // Log any assets with missing lectures
        assetsData.forEach(asset => {
          if (!lectures.some(l => l._id === asset.lectureId)) {
            console.warn('Asset with missing lecture:', {
              assetId: asset._id,
              assetName: asset.name,
              lectureId: asset.lectureId,
              lectureField: asset.lecture,
              availableLectures: lectures.map(l => ({ id: l._id, title: l.title }))
            });
          }
        });
        
        setAssets(assetsData);
      } else {
        setError(data.message || 'Failed to load assets');
        setAssets([]);
      }
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to load assets. Please try again.');
      setAssets([]);
    } finally {
      setLoadingAssets(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!selectedLecture) {
      setError("Please select a lecture.");
      return;
    }
    
    if (files.length === 0) {
      setError("Please select at least one file or folder.");
      return;
    }

    // If it's a folder upload or multiple files, require zipName
    if ((isFolderUpload || files.length > 1) && !zipName.trim()) {
      setError("Please enter a zip file name when uploading multiple files or a folder.");
      return;
    }
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      
      // Add zipName if it's a folder upload or multiple files
      if (isFolderUpload || files.length > 1) {
        formData.append("zipName", zipName.trim());
      }
      
      // Add files to form data
      files.forEach((file) => {
        formData.append("file", file);
      });
      
      const response = await fetchWithAuth(
        `${API_BASE}/assets/upload?lectureId=${encodeURIComponent(selectedLecture)}`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Upload failed. Please try again.");
      }
      
      setSuccess("Upload successful!");
      setFiles([]);
      setZipName("");
      setIsFolderUpload(false);
      await fetchAssets();
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (assetId) => {
    console.log('Fetching download URL for asset ID:', assetId);
    
    if (!assetId) {
      console.error('No asset ID provided for download');
      setError('Cannot download: No asset ID provided');
      return;
    }

    try {
      const response = await fetchWithAuth(`${API_BASE}/assets/${assetId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch asset details: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('API Response:', JSON.stringify(result, null, 2));
      
      const assetData = result?.data || result;
      if (!assetData) {
        throw new Error('Invalid response format: missing asset data');
      }
      
      const downloadUrl = assetData.downloadUrl || assetData.url;
      if (!downloadUrl) {
        console.log('Available asset data fields:', Object.keys(assetData));
        throw new Error('No download URL found in asset data');
      }

      console.log('Using download URL:', downloadUrl);
      
      // For folders or binary files
      const isBinaryFile = assetData.mimeType?.includes('octet-stream') || 
                          assetData.name?.match(/\.(exe|dll|so|o|obj|bin)$/i);
      const isFolder = assetData.isDirectory || 
                      (assetData.name && !assetData.name.includes('.')) || 
                      assetData.mimeType === 'application/zip';

      if (isBinaryFile || isFolder) {
        // For folders or binary files, fetch as blob first
        const fileResponse = await fetch(downloadUrl, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!fileResponse.ok) {
          throw new Error(`Failed to download file: ${fileResponse.status} ${fileResponse.statusText}`);
        }
        
        const blob = await fileResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // If it's a folder, ensure it has a .zip extension
        const fileName = isFolder && !assetData.name.endsWith('.zip') 
          ? `${assetData.name}.zip` 
          : assetData.name || `download-${Date.now()}`;
        
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      } else {
        // For regular files
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = assetData.name || `asset-${assetId}${assetData.mimeType ? '.' + assetData.mimeType.split('/').pop() : ''}`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setSuccess('Download started!');
      
    } catch (err) {
      console.error('Download error:', err);
      setError(`Download failed: ${err.message}`);
    }
  };

  const handleDelete = async (assetId) => {
    console.log('handleDelete called with assetId:', assetId);
    
    if (!assetId) {
      const errorMsg = 'No asset ID provided for deletion';
      console.error(errorMsg);
      setError(errorMsg);
      return;
    }

    if (!window.confirm("Are you sure you want to delete this asset? This cannot be undone.")) {
      return;
    }
    
    setDeletingId(assetId);
    setError("");
    setSuccess("");
    
    try {
      console.log('Sending delete request for asset ID:', assetId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE}/assets/asset-delete/${assetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to delete asset: ${response.status} ${response.statusText}`);
      }
      
      console.log('Delete successful, refreshing assets...');
      setSuccess('Asset deleted successfully');
      await fetchAssets(); // Refresh the assets list
      
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete asset. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAssets = assets.map(asset => {
    const lecture = lectures.find(l => l._id === asset.lectureId);
    if (!lecture) {
      console.warn('Lecture not found for asset:', {
        assetId: asset._id,
        assetName: asset.name,
        lectureId: asset.lectureId,
        availableLectureIds: lectures.map(l => l._id)
      });
    }
    return { ...asset, _lecture: lecture };
  }).filter(asset => {
    const lectureTitle = asset._lecture?.title || "";
    const uploaderName = asset.uploadedBy?.name || "";
    const searchLower = search.toLowerCase();
    return (
      asset.name.toLowerCase().includes(searchLower) ||
      lectureTitle.toLowerCase().includes(searchLower) ||
      uploaderName.toLowerCase().includes(searchLower)
    );
  });

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/admin/ui-settings", label: "UI Settings" },
    { to: "/admin/take-lecture", label: "Take Lecture" },
    { to: "/admin/profile", label: "Profile" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/transactions", label: "Transactions" },
    { to: "/admin/enrollments", label: "Enrollment" },
    { to: "/admin/admin-list", label: "Admin List" },
    { to: "/admin/contact-messages", label: "Contact Messages" },
    { to: "/admin/publish-asset", label: "Publish Asset" },
    { to: "/admin/post-blog", label: "Post Blog" },
  ];

  return (
    <>
      <AdminNav navLinks={navLinks} onLogout={logout} />
      <div className="publish-asset-container" style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
        <h2 style={{ marginBottom: 12 }}>Publish Asset</h2>
        <p style={{ marginBottom: 24 }}>Upload and manage assets here. {files.length > 1 && "Multiple files will be zipped before upload."}</p>

        <form onSubmit={handleUpload} style={{ marginBottom: 32, background: "#f9f9f9", padding: 24, borderRadius: 8 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>
              <b>Lecture:</b>
            </label>
            <select
              value={selectedLecture}
              onChange={(e) => setSelectedLecture(e.target.value)}
              style={{ 
                width: '100%',
                padding: "10px 12px", 
                borderRadius: 4, 
                border: "1px solid #ddd",
                fontSize: 15
              }}
              required
            >
              <option value="">Select a lecture</option>
              {lectures.map((lec) => (
                <option key={lec._id} value={lec._id}>
                  {lec.title}
                </option>
              ))}
            </select>
          </div>
          
          {(isFolderUpload || files.length > 1) && (
            <div style={{ marginBottom: 16 }}>
              <label>
                <b>Zip File Name:</b>
                <input
                  type="text"
                  value={zipName}
                  onChange={(e) => setZipName(e.target.value)}
                  placeholder="e.g., lecture-assets"
                  style={{ 
                    width: '100%',
                    padding: "10px 12px", 
                    borderRadius: 4, 
                    border: "1px solid #ddd",
                    marginTop: 8,
                    fontSize: 15
                  }}
                  required={(isFolderUpload || files.length > 1)}
                />
              </label>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                Required for multiple files. ".zip" will be added automatically.
              </div>
            </div>
          )}
          
          <div style={{ marginBottom: 16 }}>
            <div 
              {...getRootProps()} 
              style={{ 
                border: '2px dashed #ccc', 
                padding: '40px 20px',
                borderRadius: 8,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? '#f0f7ff' : 'white',
                transition: 'background-color 0.2s'
              }}
            >
              <input {...getInputProps()} />
              <div style={{ fontSize: 16, marginBottom: 8 }}>
                {isDragActive 
                  ? 'Drop the files here...' 
                  : 'Drag & drop files here, or click to select files'}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>
                Supports images, documents, PDFs, and more. Max 20 files.
              </div>
            </div>
            
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <span style={{ color: '#666' }}>OR</span>
            </div>
            
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', marginBottom: 8 }}>
                <b>Select Folder:</b>
              </label>
              <div style={{ 
                border: '1px solid #ddd',
                borderRadius: 4,
                padding: '10px 12px',
                backgroundColor: isFolderUpload ? '#f9f9f9' : 'white',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <input
                  type="file"
                  webkitdirectory=""
                  directory=""
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      setFiles(Array.from(e.target.files));
                      setIsFolderUpload(true);
                      
                      // Auto-generate a zip name based on the folder name
                      const path = e.target.files[0].webkitRelativePath;
                      if (path) {
                        const folderName = path.split('/')[0];
                        setZipName(folderName);
                      }
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <div style={{ color: '#666' }}>
                  {isFolderUpload 
                    ? `${files.length} files selected` 
                    : 'Click to select a folder (preserves folder structure)'}
                </div>
              </div>
            </div>
          </div>
          
          {files.length > 0 && (
            <div style={{ 
              marginTop: 16, 
              marginBottom: 16, 
              padding: 12, 
              background: '#f0fff4',
              border: '1px solid #c6f6d5',
              borderRadius: 6,
              color: '#2f855a',
              fontSize: 14
            }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Selected files:</div>
              <div style={{ maxHeight: 150, overflowY: 'auto', fontSize: 14 }}>
                {files.map((file, idx) => (
                  <div key={idx} style={{ 
                    padding: '4px 0',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '90%'
                    }}>
                      {file.webkitRelativePath || file.name}
                    </span>
                    <span style={{ color: '#666', fontSize: '0.85em' }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
                Total: {files.length} file{files.length !== 1 ? 's' : ''} • 
                {Math.round(files.reduce((acc, file) => acc + file.size, 0) / 1024)} KB
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={uploading || files.length === 0 || !selectedLecture}
            style={{
              background: (uploading || files.length === 0 || !selectedLecture) ? "#ccc" : "#2d8cff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "12px 24px",
              fontWeight: 600,
              cursor: (uploading || files.length === 0 || !selectedLecture) ? "not-allowed" : "pointer",
              width: '100%',
              fontSize: 16,
              transition: 'background-color 0.2s',
              marginTop: 8
            }}
          >
            {uploading ? (
              <span>Uploading... <i className="fas fa-spinner fa-spin"></i></span>
            ) : files.length === 0 ? (
              "Select files to upload"
            ) : (
              `Upload ${files.length} file${files.length !== 1 ? 's' : ''}`
            )}
          </button>
          
          {error && (
            <div style={{
              marginTop: 12,
              padding: '10px 12px',
              background: '#fff0f0',
              border: '1px solid #ffd0d0',
              borderRadius: 4,
              color: '#d32f2f',
              fontSize: 14
            }}>
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          
          {success && (
            <div style={{
              marginTop: 12,
              padding: '10px 12px',
              background: '#f0fff4',
              border: '1px solid #c6f6d5',
              borderRadius: 4,
              color: '#2f855a',
              fontSize: 14
            }}>
              <i className="fas fa-check-circle"></i> {success}
            </div>
          )}
        </form>

        <div style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Uploaded Assets</h3>
            <div style={{ position: 'relative', width: '40%' }}>
              <input
                type="text"
                placeholder="Search by name, lecture, or uploader..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  fontSize: 14,
                  background: 'white',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              />
              <i className="fas fa-search" style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#999'
              }}></i>
            </div>
          </div>
          
          {loadingAssets ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              padding: '40px 0',
              color: '#666'
            }}>
              <i className="fas fa-spinner fa-spin" style={{ marginRight: 10 }}></i> Loading assets...
            </div>
          ) : filteredAssets.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              background: '#f9f9f9',
              borderRadius: 8,
              border: '1px dashed #ddd',
              color: '#666'
            }}>
              <i className="fas fa-inbox" style={{ fontSize: 32, marginBottom: 12, opacity: 0.6 }}></i>
              <div>No assets uploaded yet.</div>
              <div style={{ fontSize: 13, marginTop: 8 }}>Upload your first file using the form above.</div>
            </div>
          ) : (
            <div style={{
              background: 'white',
              borderRadius: 8,
              border: '1px solid #eee',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ 
                    background: '#f7f9fc',
                    borderBottom: '1px solid #eee',
                    textAlign: 'left'
                  }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14, color: '#4a5568' }}>Name</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14, color: '#4a5568' }}>Lecture</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14, color: '#4a5568' }}>Uploaded By</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14, color: '#4a5568', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} style={{ 
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background-color 0.2s',
                      ':hover': {
                        backgroundColor: '#f9f9f9'
                      }
                    }}>
                      <td style={{ 
                        padding: '14px 16px',
                        fontSize: 14,
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {getFileIcon(asset.mimeType, asset.name)}
                          <span style={{ marginLeft: 8 }}>{asset.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#4a5568' }}>
                        {asset._lecture?.title || 'Unknown Lecture'}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#4a5568' }}>
                        {typeof asset.uploadedBy === 'object' ? asset.uploadedBy?.name : 'Unknown User'}
                      </td>
                      <td style={{ 
                        padding: '14px 16px',
                        textAlign: 'right',
                        whiteSpace: 'nowrap'
                      }}>
                        <button
                          onClick={() => handleDownload(asset.id)}
                          style={{
                            background: 'transparent',
                            color: '#2d8cff',
                            border: '1px solid #2d8cff',
                            borderRadius: 4,
                            padding: '6px 12px',
                            cursor: 'pointer',
                            marginRight: 8,
                            fontSize: 13,
                            transition: 'all 0.2s',
                            ':hover': {
                              background: '#f0f7ff'
                            }
                          }}
                        >
                          <i className="fas fa-download" style={{ marginRight: 4 }}></i> Download
                        </button>
                        
                        {(currentUser.isAdmin || asset.uploadedBy?._id === currentUser.id || 
                          (typeof asset.uploadedBy === 'string' && asset.uploadedBy === currentUser.id)) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Delete clicked for asset:', asset);
                              if (!asset?.id) {
                                console.error('No asset ID found for deletion in asset:', asset);
                                setError('Cannot delete: Invalid asset data');
                                return;
                              }
                              handleDelete(asset.id);
                            }}
                            disabled={deletingId === asset.id}
                            style={{
                              background: deletingId === asset.id ? '#f8d7da' : 'transparent',
                              color: deletingId === asset.id ? '#721c24' : '#dc3545',
                              border: `1px solid ${deletingId === asset.id ? '#f5c6cb' : '#dc3545'}`,
                              borderRadius: 4,
                              padding: '6px 12px',
                              cursor: deletingId === asset.id ? 'not-allowed' : 'pointer',
                              fontSize: 13,
                              transition: 'all 0.2s',
                              ':hover': deletingId !== asset.id ? {
                                background: '#f8d7da'
                              } : {},
                              opacity: deletingId === asset.id ? 0.7 : 1
                            }}
                          >
                            {deletingId === asset.id ? (
                              <span><i className="fas fa-spinner fa-spin" style={{ marginRight: 4 }}></i> Deleting...</span>
                            ) : (
                              <span><i className="fas fa-trash-alt" style={{ marginRight: 4 }}></i> Delete</span>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

function getFileIcon(mimeType, fileName = '') {
  // Check file extensions first
  if (fileName && fileName.match(/\.(c|cpp|h|hpp)$/i)) return 'fa-file-code';
  if (fileName && fileName.match(/\.(exe|dll|so|o|obj|bin)$/i)) return 'fa-file-code';

  const iconMap = {
    'image/': 'fa-file-image',
    'application/pdf': 'fa-file-pdf',
    'application/msword': 'fa-file-word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fa-file-word',
    'application/vnd.ms-excel': 'fa-file-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'fa-file-excel',
    'application/vnd.ms-powerpoint': 'fa-file-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'fa-file-powerpoint',
    'text/': 'fa-file-alt',
    'application/zip': 'fa-file-archive',
    'application/x-rar-compressed': 'fa-file-archive',
    'text/x-c': 'fa-file-code',
    'text/x-csrc': 'fa-file-code',
    'text/x-c++src': 'fa-file-code',
    'application/x-executable': 'fa-file-code',
    'application/octet-stream': 'fa-file-code',
    'default': 'fa-file'
  };
  
  let iconClass = 'fa-file';
  
  for (const [key, value] of Object.entries(iconMap)) {
    if (mimeType && mimeType.startsWith(key)) {
      iconClass = value;
      break;
    }
  }
  
  return (
    <i 
      className={`fas ${iconClass}`} 
      style={{ 
        color: getFileIconColor(mimeType, fileName),
        width: 20,
        textAlign: 'center'
      }}
    ></i>
  );
}

function getFileIconColor(mimeType, fileName = '') {
  // Handle C/C++ files
  if (fileName && fileName.match(/\.(c|cpp|h|hpp)$/i)) return '#3498db';
  // Handle executables and binaries
  if ((fileName && fileName.match(/\.(exe|dll|so|o|obj|bin)$/i)) || 
      (mimeType && (mimeType.includes('octet-stream') || 
                    mimeType.includes('x-executable')))) {
    return '#8e44ad';
  }
  // Existing color mappings
  if (mimeType) {
    if (mimeType.includes('pdf')) return '#e74c3c';
    if (mimeType.includes('word') || mimeType.includes('document')) return '#2c7be5';
    if (mimeType.includes('excel') || mimeType.includes('sheet')) return '#27ae60';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '#e67e22';
    if (mimeType.includes('image')) return '#9b59b6';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return '#f39c12';
    if (mimeType.includes('text')) return '#3498db';
  }
  return '#7f8c8d';
}

export default PublishAsset;
