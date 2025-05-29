import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../assets/styles/dashboard/UserDashboard.css';
import DashMobileNav from '../components/userDashCom/dashMobileNav';
import FullscreenIcon from "../components/userDashCom/fullscreenIcon";
import { Link } from "react-router-dom";
import myteacherLogo from '../img/Untitled-1.png';


// Initial deomassets data import
import myteacherIntituteFileIcon from '../img/myteacher-intitute-file-icon.jpg';
import myteacherIntituteFolderIcon from '../img/myteacher-intitute-folder-icon.jpg';
import myteacherIntituteImageIcon from '../img/myteacher-intitute-image-icon.jpg';
import myteacherIntitutePdfIcon from '../img/myteacher-intitute-pdf-icon.png';


import myteacherTechIllustrationImage from '../assets/illustrations/dashboard/myteacher tech illustration image.jpg';

// Sample asset data
const initialAssets = [
  {
    id: 1,
    name: "Project Files",
    type: "Folder",
    status: "Available",
    expiry: "N/A",
    icon: "fa-folder",
    file: null
  },
  {
    id: 2,
    name: "Design Mockup",
    type: "Image",
    status: "Available",
    expiry: "N/A",
    icon: "fa-file-image",
    file: null
  },
  {
    id: 3,
    name: "Course Material",
    type: "PDF",
    status: "Available",
    expiry: "N/A",
    icon: "fa-file-pdf",
    file: null
  }
];


const DemoAsset = [
  {
    id: 1,
    name: "Font awesome",
    type: "folder",
    status: "Available",
    expiry: "N/A",
    icon: myteacherIntituteFolderIcon,
    author: "loveday jeo",
    date: "5/16/2024",
    file: null
  },
  {
    id: 2,
    name: "Design Mockup",
    type: "Image",
    status: "Available",
    expiry: "N/A",
    icon: myteacherIntituteImageIcon,
    author: "Chima",
    date: "2/16/2025",
    file: null
  },
  {
    id: 3,
    name: "CSS font explanation",
    type: "PDF",
    status: "Available",
    expiry: "N/A",
    icon: myteacherIntitutePdfIcon,
    author: "Terry",
    date: "5/16/2022",
    file: null
  },
  {
    id: 4,
    name: "JavaScript Basics",
    type: "PDF",
    status: "Available",
    expiry: "N/A",
    icon: myteacherIntituteFileIcon,
    author: "Jeo",
    date: "2/1/2025",
    file: null
  },
  {
    id: 5,
    name: "React Guide",
    type: "PDF",
    status: "Available",
    expiry: "N/A",
    icon: myteacherIntitutePdfIcon,
    author: "Jeo",
    date: "2/6/2025",
    file: null
  },
  {
    id: 6,
    name: "Node.js Documentation",
    type: "PDF",
    status: "Available",
    expiry: "N/A",
    icon: myteacherIntitutePdfIcon,
    author: "Jeo",
    date: "5/16/2023",
    file: null
  },
  {
    id: 7,
    name: "Web Development Resources",
    type: "folder",
    status: "Available",
    expiry: "N/A",
    icon: myteacherIntituteFolderIcon,
    author: "samual",
    date: "5/16/2024",
    file: null
  },
  {
    id: 8,
    name: "CSS Frameworks",
    type: "PDF",
    status: "Available",
    expiry: "N/A",
    icon: myteacherIntitutePdfIcon,
    author: "Chima",
    date: "1/1/2025",
    file: null
  },
    {
    id: 9,
    name: "CSS Animation",
    type: "folder",
    status: "Available",
    expiry: "N/A",
    icon: myteacherIntituteFolderIcon,
    author: "Jeo",
    date: "4/16/2025",
    file: null
  },
  {
    id: 10,
    name: "htassec",
    type: "file",
    status: "Available",
    expiry: "N/A",
    icon: myteacherIntituteFileIcon,
    author: "Jeo",
    date: "3/1/2025",
    file: null
  },
  {
    id: 11,
    name: "Dev illustration images pack",
    type: "image",
    status: "Available",
    expiry: "N/A",
    icon: myteacherIntituteImageIcon,
    author: "Chinedu samual",
    date: "5/16/2025",
    file: null
  }
];

function Assets() {
  const [isExpanded, setIsExpanded] = useState(true);

  // Theme state
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleSidebar = () => setIsExpanded(prev => !prev);
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const isLightMode = theme === 'light';

  // Asset management state
  const [assets, setAssets] = useState(initialAssets);
  const [search, setSearch] = useState("");
  // global assets section
  const [demoAssets, setDemoAssets] = useState(DemoAsset); 
  const [searchDemo, setSearchDemo] = useState("");
  const [visibleAssetId, setVisibleAssetId] = useState(null);
  const [showAssetDescrption, setShowAssetDescrption] = useState(false);


  const [showAdd, setShowAdd] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "PDF",
    status: "Available",
    expiry: "",
    icon: "fa-file-pdf",
    file: null
  });

  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareInfo, setShareInfo] = useState({ assetId: "", username: "" });
  const [shareSuccess, setShareSuccess] = useState(false);

  // Initialize assets with demo data
  // useEffect(() => {
  //   // Simulate fetching assets from an API or database
  //   setAssets(DemoAsset);
  // }, []);

  // Filtered assets from the demo data
  const filteredFromAssetsStore = demoAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchDemo.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchDemo.toLowerCase())
  );


  // Filtered assets
  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(search.toLowerCase()) ||
    asset.type.toLowerCase().includes(search.toLowerCase())
  );


    // Handle file/folder selection
  // const handleDemoFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   let type = "file";
  //   if (file.type.includes("pdf")) {
  //     icon = "fa-file-pdf";
  //     type = "PDF";
  //   } else if (file.type.includes("image")) {
  //     icon = "fa-file-image";
  //     type = "Image";
  //   } else if (file.type.includes("file")) {
  //     icon = "fa-file-image";
  //     type = "Image";
  //   }
  //    else if (file.type === "folder") {
  //     icon = "fa-folder";
  //     type = "Folder";
  //   }
  // };



  // Handle file/folder selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    let icon = "fa-file";
    let type = "File";
    if (file.type.includes("pdf")) {
      icon = "fa-file-pdf";
      type = "PDF";
    } else if (file.type.includes("image")) {
      icon = "fa-file-image";
      type = "Image";
    } else if (file.type === "") {
      // likely a folder (webkitdirectory)
      icon = "fa-folder";
      type = "Folder";
    }
    setNewAsset({
      ...newAsset,
      name: file.name,
      type,
      icon,
      file
    });
  };

  // Add asset handler
  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.type) return;
    setAssets([
      ...assets,
      { ...newAsset, id: Date.now() }
    ]);
    setNewAsset({
      name: "",
      type: "PDF",
      status: "Available",
      expiry: "",
      icon: "fa-file-pdf",
      file: null
    });
    setShowAdd(false);
  };

  // Delete asset handler
  const handleDelete = (id) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

  // Download handler for files
  const handleDownload = (asset) => {
    if (asset.file) {
      const url = URL.createObjectURL(asset.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = asset.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Share asset handler
  const handleShareSubmit = (e) => {
    e.preventDefault();
    setShowShareModal(false);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
    setShareInfo({ assetId: "", username: "" });
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      <DashMobileNav theme={theme} />
      <ThemeStyles theme={theme} />

      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '8px 12px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: isLightMode ? '#333' : '#f0f0f0',
          color: isLightMode ? '#fff' : '#000',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <i
          className={`fas fa-${isLightMode ? 'moon' : 'sun'}`}
          style={{ marginRight: '8px', fontSize: '16px' }}
        ></i>
        {/* {isLightMode ? 'Dark Mode' : 'Light Mode'} */}
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
          <NavItem icon="chalkboard-teacher" label="Online Class" move="/online-class" isExpanded={isExpanded} />
          <NavItem icon="briefcase" label="Assets" move="/assets" isExpanded={isExpanded} />
          <NavItem icon="cog" label="Settings" move="/settings" isExpanded={isExpanded} />
          <NavItem icon="question-circle" label="Help" move="/help" isExpanded={isExpanded} />
          <NavItem icon="right-from-bracket" label="Log Out" move="/logout" isExpanded={isExpanded} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 style={{ margin: "40px 0 20px 0" }}>💼 Assets</h1>

        {/* this is the assets store section */}
        <div className='asset-store'>
          <div className="asset-store-header">
          <img src={myteacherLogo} alt="MyTeacher Logo" />
          <h2>Asset Store</h2>
          <p>Explore a variety of resources shared by the community. You can download, share, and contribute your own assets.</p>
          </div>
            <input
              type="text"
              placeholder="Search assets..."
              value={searchDemo}
              onChange={e => setSearchDemo(e.target.value)}
              // className="assets-search"
            />
          <div className="asset-store-content">
            {/* {filteredFromAssetsStore.slice(0, 7).map((asset) => ( */}
            {filteredFromAssetsStore.map((asset) => (
              <div className="asset-box" key={asset.id}>
                <div className="asset-box-icon">
                  <img src={asset.icon} alt="asset logo" />
                </div>
                <div className="asset-box-info">
                  <h2>{asset.name}</h2>
                  <p>Date: {asset.date}</p>
                  <p>Author: {asset.author}</p>
                  <div className="icons-sec">
                    <i class="fas fa-download"></i>
                    <i class="fas fa-folder-plus"></i>
                  <i
                    className={`fa fa-chevron-${visibleAssetId === asset.id ? 'up' : 'down'}`}
                    onClick={() =>
                      setVisibleAssetId(visibleAssetId === asset.id ? null : asset.id)
                    }
                    style={{ cursor: 'pointer' }}
                  ></i>
                  </div>
                </div>
                <div
                  className="asset-product-description"
                  style={{ display: visibleAssetId === asset.id ? 'block' : 'none' }}
                >
                  <p style={{fontSize: '1.9rem'}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="assets-panel">
          <div className="assets-panel-header">
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="assets-search"
            />
            <button
              onClick={() => setShowAdd(true)}
              className="assets-add-btn"
            >
              <i className="fas fa-plus" style={{ marginRight: 6 }}></i>
              Add Asset
            </button>
          </div>

          {/* Asset Table */}
          <div className="assets-table-wrap">
            <table className="assets-table">
              <thead>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Expiry</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "32px 0", color: "#888" }}>
                      No assets found.
                    </td>
                  </tr>
                )}
                {filteredAssets.map((asset, idx) => (
                  <tr key={asset.id}>
                    <td style={tdStyle}>{idx + 1}</td>
                    <td style={tdStyle}>
                      <i className={`fas ${asset.icon}`} style={{ marginRight: 8 }}></i>
                      {asset.name}
                    </td>
                    <td style={tdStyle}>{asset.type}</td>
                    <td style={tdStyle}>{asset.status}</td>
                    <td style={tdStyle}>{asset.expiry}</td>
                    <td style={tdStyle}>
                      {asset.file && (
                        <button
                          className="assets-action-btn"
                          onClick={() => handleDownload(asset)}
                          title="Download"
                        >
                          <i className="fas fa-download"></i>
                        </button>
                      )}
                      <button
                        className="assets-action-btn delete"
                        onClick={() => handleDelete(asset.id)}
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Asset Modal */}
          {showAdd && (
            <div className="assets-modal-bg">
              <form
                onSubmit={handleAddAsset}
                className="assets-modal-form"
                encType="multipart/form-data"
              >
                <h2>Add New Asset</h2>
                <input
                  type="text"
                  placeholder="Asset Name"
                  value={newAsset.name}
                  onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
                  required
                  className="assets-modal-input"
                />
                <select
                  value={newAsset.type}
                  onChange={e => {
                    let icon = "fa-box";
                    if (e.target.value === "PDF") icon = "fa-file-pdf";
                    else if (e.target.value === "Image") icon = "fa-file-image";
                    else if (e.target.value === "Folder") icon = "fa-folder";
                    setNewAsset({ ...newAsset, type: e.target.value, icon });
                  }}
                  className="assets-modal-input"
                >
                  <option value="PDF">PDF File</option>
                  <option value="Image">Image File</option>
                  <option value="Folder">Folder</option>
                </select>
                <input
                  type="text"
                  placeholder="Status (e.g. Available, In Use)"
                  value={newAsset.status}
                  onChange={e => setNewAsset({ ...newAsset, status: e.target.value })}
                  required
                  className="assets-modal-input"
                />
                <input
                  type="date"
                  placeholder="Expiry Date"
                  value={newAsset.expiry}
                  onChange={e => setNewAsset({ ...newAsset, expiry: e.target.value })}
                  className="assets-modal-input"
                />
                <label className="assets-modal-label">
                  Upload File/Folder:
                  <input
                    type="file"
                    webkitdirectory="true"
                    directory="true"
                    onChange={handleFileChange}
                    className="assets-modal-input"
                    style={{ marginTop: 8 }}
                  />
                </label>
                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button
                    type="submit"
                    className="assets-modal-btn"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="assets-modal-btn cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* social side of assets.jsx */}
        <div className='asset-community-section'>
          <div className='share-asset'>
            <h3>Share Resources with Tech Partner</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                setShowShareModal(true);
              }}
              style={{marginBottom: 8 }}
            >
            <input
                type="text"
                placeholder="Recipient Username"
                required
                value={shareInfo.username}
                onChange={e => setShareInfo({ ...shareInfo, username: e.target.value })}
                style={{ padding: 6, borderRadius: 4 }}
              />
              <select
                required
                value={shareInfo.assetId}
                onChange={e => setShareInfo({ ...shareInfo, assetId: e.target.value })}
                style={{ padding: 6, borderRadius: 4 }}
              >
                <option value="">Select Asset</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name}</option>
                ))}
              </select>
              <button
                type="submit"
                style={{
                  background: "#086cca",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                <i className="fas fa-share" style={{ marginRight: 4 }}></i>
                Share
              </button>
            </form>
          </div>
          <div className='share-to-cummunity'>
            <div className="share-to-cummunity-header">
              <img src={myteacherLogo} alt="" />
              <h2>Publish asset</h2>
            </div>
            
            <form
              onSubmit={e => {
                e.preventDefault();
                setShowShareModal(true);
              }}
              style={{marginBottom: 8 }}
            >
              <textarea
                placeholder="Description..."
                required
                value={shareInfo.username}
                onChange={e => setShareInfo({ ...shareInfo, username: e.target.value })}
                style={{ padding: 6, borderRadius: 4 }}
              />
              <select
                required
                value={shareInfo.assetId}
                onChange={e => setShareInfo({ ...shareInfo, assetId: e.target.value })}
                style={{ padding: 6, borderRadius: 4 }}
              >
                <option value="">Select Asset</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name}</option>
                ))}
              </select>
              <button
                type="submit"
                style={{
                  background: "#086cca",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                <i className="fas fa-share" style={{ marginRight: 4 }}></i>
                Share
              </button>
            </form>
            <div>
            </div>
          </div>
          <div className="start-up">
            <img src={myteacherTechIllustrationImage} alt="illustration" />
            <h2>Project Management</h2>
            <Link className="startup-btn"><i className="fas fa-plus"></i> Create project</Link>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="assets-modal-bg">
          <div className="assets-modal-form" style={{ minWidth: 300, textAlign: "center" }}>
            <h2>Confirm Share</h2>
            <p>
              Share <b>{assets.find(a => a.id === Number(shareInfo.assetId))?.name || ""}</b> with user <b>{shareInfo.username}</b>?
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: 16 }}>
              <button
                onClick={handleShareSubmit}
                className="assets-modal-btn"
                style={{ minWidth: 80 }}
              >
                Yes, Share
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="assets-modal-btn cancel"
                style={{ minWidth: 80 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {shareSuccess && (
        <div className="assets-modal-bg">
          <div className="assets-modal-form" style={{ minWidth: 250, textAlign: "center" }}>
            <i className="fas fa-check-circle" style={{ color: "#27ae60", fontSize: 48, marginBottom: 12 }}></i>
            <div>Asset shared successfully!</div>
          </div>
        </div>
      )}

      <style jsx="true">{`

        .asset-store{
          width: 100%;
          padding: 20px;
          background: ${isLightMode ? "#fff" : "#23272f"};
          min-height: 500px;
          margin: 30px 0;
        }
        .asset-store > .asset-store-header{
          display: flex;
          gap: 5px;
          flex-direction: column;
          // background: ${isLightMode ? "#086cca" : "#23272f"};
          // color: ${isLightMode ? "#fff" : "#fff"};
          align-items: center;
        }
        .asset-store > .asset-store-header > img{
          width: 55px;
        }
        .asset-store > .asset-store-header > h2{
          font-size: 2.5rem;
        }
        .asset-store > .asset-store-header > p{
          font-size: 1.8rem;
        }
        .asset-store > .asset-store-content{
          display: flex;
          flex-direction: column;
          gap: 20px;
          justify-content: start;
          overflow-y: scroll;
          overflow-x: hidden;
          width: 100%;
          padding: 20px;
          height: 490px;
        }
        .asset-store > input{
          background: ${isLightMode ? "transparent" : "#23272f"};
          color: ${isLightMode ? "#000" : "#fff"};
          font-size: 2rem;
          width: 270px;
          margin: 20px 20px;
          border: 0;
          border-bottom: 1px solid ${isLightMode ? "#000" : "#fff"};
          outline: none;
          padding: 10px;
        }
        .asset-store > .asset-store-content > .asset-box {
          width: 100%;
          background: ${isLightMode ? "#f5f7fa" : "#2c2f36"};
          // border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          display: flex;
          // flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          transition: transform 0.2s;
          gap: 20px;
          cursor: pointer;
        }
        .asset-store > .asset-store-content > .asset-box:hover {
          transform: translateY(-4px);
        }
        .asset-store > .asset-store-content > .asset-box > .asset-box-icon {
          width: 60px;
          height: 60px;
          overflow: hidden;
          // border-radius: 50%;
          align-items: center;
          background: ${isLightMode ? "#e0e4e8" : "#3a3f47"};
          margin-bottom: 12px;
        }
        .asset-store > .asset-store-content > .asset-box > .asset-box-icon > img{
          width: 60px;
          object-fit: fill;
        }
        .asset-store > .asset-store-content > .asset-box > .asset-box-info{
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
          align-items: center;
        }
        .asset-store > .asset-store-content > .asset-box > .asset-box-info > .icons-sec{
          // position: absolute;
          // position: relative;
          // right: 0;
          display: inline-flex;
          gap: 40px;
          transition: all 0.6s ease-in;
          font-size: 2rem;
        }
        .asset-store > .asset-store-content > .asset-box > .asset-box-info > .icons-sec > i{
          background: ${isLightMode ? "#23272f" : "#fff"};
          color: ${isLightMode ? "#fff" : "#000"};
          padding: 10px;
          border-radius: 20px;
        }
        .asset-store > .asset-store-content > .asset-box > .asset-box-info > .icons-sec > i:hover{
          background: ${isLightMode ? "#096cca" : "#086cca"};
          color: ${isLightMode ? "#fff" : "#fff"};
        }
        .asset-store > .asset-store-content > .asset-box > .asset-box-info > p, .asset-store > .asset-store-content > .asset-box > .asset-box-info > h2, .asset-store > .asset-store-content > .asset-box > .asset-box-info > i{
          font-size: 1.7rem;
        }
        .assets-panel {
          background: ${isLightMode ? "#fff" : "#23272f"};
          border-radius: 12px;
          padding: 32px;
          min-height: 300px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
        }
        .assets-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .assets-search {
          background: ${isLightMode ? "transparent" : "#23272f"};
          color: ${isLightMode ? "#000" : "#fff"};
          font-size: 1.3rem;
          width: 240px;
          border: 0;
          border-bottom: 1px solid ${isLightMode ? "#000" : "#fff"};
          outline: none;
          padding: 10px;
        }
        .assets-add-btn {
          background: #086cca;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 18px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .assets-table-wrap {
          overflow-x: auto;
        }
        .assets-table {
          width: 100%;
          border-collapse: collapse;
          background: inherit;
        }
        .assets-table-wrap > .assets-table > thead > th, .assets-table-wrap > .assets-table > tbody td {
          padding: 12px 10px;
          font-size: 2rem;
        }
        .assets-table th {
          text-align: left;
          font-weight: 700;
          background: ${isLightMode ? "#f5f7fa" : "#23272f"};
        }
        .assets-table tr {
          border-bottom: 1px solid #eee;
        }
        .assets-action-btn {
          background: #eee;
          color: #333;
          border: none;
          border-radius: 4px;
          padding: 4px 10px;
          cursor: pointer;
          margin-right: 6px;
          font-size: 1rem;
        }
        .assets-action-btn.delete {
          background: #e74c3c;
          color: #fff;
        }
        .assets-action-btn:hover {
          opacity: 0.85;
        }
        .assets-modal-bg {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .assets-modal-form {
          background: #fff;
          border-radius: 12px;
          padding: 32px 24px;
          min-width: 320px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .assets-modal-input {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 1rem;
        }
        .assets-modal-btn {
          background: #086cca;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 18px;
          font-weight: 600;
          cursor: pointer;
        }
        .assets-modal-btn.cancel {
          background: #eee;
          color: #333;
        }
        .assets-modal-label {
          font-size: 1rem;
          color: #333;
          margin-bottom: 0;
        }
        .asset-community-section{
            display: flex;
            margin: 30px 0;
            flex-wrap: wrap;
            width: 100%;
        }
        .asset-community-section > .share-asset{
            display: flex;
            font-size: 2rem;
            font-weigth: 900;
            flex-direction: column;
            gap: 5px;
        }
        .asset-community-section > .share-asset > form{
            display: flex;
            width: 400px;
            flex-direction: column;
            gap: 15px;
            justify-content: space-around;
            padding: 0;
        }
        .asset-community-section > .share-asset > form > input{
            width: 100%;
            outline: none;
            background: ${isLightMode ? "#f5f7fa" : "#23272f"};
            color: ${isLightMode ? "#000" : "#fff"};
            font-size: 1.5rem;
        }
        .asset-community-section > .share-asset > form > select{
            width: 50%;
            background: ${isLightMode ? "#f5f7fa" : "#23272f"};
            color: ${isLightMode ? "#000" : "#fff"};
            font-size: 1.5rem;
        }
        .asset-community-section{
            display: flex;
            align-items: center;
            gap: 30px;
        }
        .share-to-cummunity{
          display: flex;
          border: 0;
          border-left: 3px solid ${isLightMode ? "#000" : "#fff"};
          flex-direction: column;
          padding: 10px;
          gap: 20px;
        }
        .share-to-cummunity > .share-to-cummunity-header{
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .share-to-cummunity > .share-to-cummunity-header > img{
          width: 50px;
        }
        .share-to-cummunity > .share-to-cummunity-header > h2{
          font-size: 2rem;
          font-weigth: 900;
        }
        .share-to-cummunity > form{
          display: flex;
          width: 400px;
          flex-direction: column;
          gap: 15px;
          justify-content: space-around;
          padding: 0;
        }
        .share-to-cummunity > form > textarea{
            width: 100%;
            height: 100px;
            outline: none;
            font-size: 1.5rem;
            background: ${isLightMode ? "#f5f7fa" : "#23272f"};
            color: ${isLightMode ? "#000" : "#fff"};
        }
        .share-to-cummunity > form > select{
            width: 50%;
            background: ${isLightMode ? "#f5f7fa" : "#23272f"};
            color: ${isLightMode ? "#000" : "#fff"};
            font-size: 1.5rem;
        }
        .start-up{
          display: flex;
          border: 0;
          border-left: 3px solid ${isLightMode ? "#000" : "#fff"};
          flex-direction: column;
          padding: 10px;
          gap: 20px;
          // align-items: center;
        }
        .start-up > img{
          width: 300px;
        }
        .start-up > h2{
          font-size: 2rem;
        }
        .start-up > .startup-btn{
          color: ${isLightMode ? "#fff" : "#fff"};
          background: ${isLightMode ? "#086cca" : "#086cca"};
          padding: 10px 30px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 2rem;
          text-align: center;
          transition: all 0.6s ease-in-out;
        }

        .start-up > .startup-btn:hover{
          opacity: 0.90;
          transform: translatey(-5px);
        }
        
        .main-content > h1{
          font-size: 3rem;
        }

        @media (max-width: 600px) {
          .assets-panel {
            padding: 10px 2vw 18px 2vw;
            min-width: 0;
          }
          .assets-modal-form {
            min-width: 90vw;
            padding: 18px 8px;
          }
          .asset-community-section > .share-asset > form{
            padding: 10px;
          }
          .share-to-cummunity > form{
            padding: 10px;
          }
          .share-asset > h3{
            margin-left: 10px;
          }
          .share-to-cummunity > .share-to-cummunity-header{
            margin-left: 10px;
          }
          .main-content .assets-add-btn{
            font-size: 1.2rem;
          }
          .share-to-cummunity{
            border-left: 0;
            padding: 0;
          }
          .start-up{
          border-left: 0;
          padding: 0;
        }
        }
      `}</style>
    </div>
  );
}

const thStyle = {
  padding: "12px 10px",
  textAlign: "left",
  fontWeight: 700,
  fontSize: "1rem",
  background: "inherit"
};

const tdStyle = {
  padding: "10px 10px",
  fontSize: "1rem",
  background: "inherit"
};

function NavItem({ icon, label, isExpanded, move }) {
  return (
    <Link className="nav-item" to={move}>
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

function ThemeStyles({ theme }) {
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--bg-color', '#fff');
      root.style.setProperty('--text-color', '#000');
      root.style.setProperty('--sidebar-bg', '#f5f5f5');
      root.style.setProperty('--sidebar-text', '#000');
    } else {
      root.style.setProperty('--bg-color', '#222');
      root.style.setProperty('--text-color', '#fff');
      root.style.setProperty('--sidebar-bg', '#333');
      root.style.setProperty('--sidebar-text', '#fff');
    }
  }, [theme]);
  return null;
}

export default Assets;