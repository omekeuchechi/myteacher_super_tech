import React, { useState, useEffect, useContext } from "react";
import { useDropzone } from 'react-dropzone';
import { fromEvent } from 'file-selector';
import AdminNav from "../../components/adminCom/navSection";
import { AuthContext } from "../../../context/Authcontext";

const API_BASE = import.meta.env.VITE_BASEURL;

// Helper: fetch with auth
const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem("token");
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
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
  const [uploading, setUploading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [isFolderSelected, setIsFolderSelected] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length <= 20) {
      setFiles(acceptedFiles);
      setIsFolderSelected(false);
    } else {
      setError("You can only upload up to 20 files at a time.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    getFilesFromEvent: (event) => fromEvent(event),
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'image/svg+xml': ['.svg']
    },
    multiple: true,
    disabled: isFolderSelected
  });

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  // Fetch lectures for dropdown (admin: all lectures)
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE}/lectures/lectures`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.lectures)) {
          setLectures(data.lectures);
        }
      } catch (err) {
        // ignore
      }
    };
    fetchLectures();
  }, []);

  // Fetch assets (admin: all assets)
  const fetchAssets = async () => {
    setLoadingAssets(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/assets/all`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setAssets(data);
      } else {
        setAssets([]);
      }
    } catch (err) {
      setAssets([]);
    }
    setLoadingAssets(false);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Handle file input
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setIsFolderSelected(true);
  };

  // Handle upload (multipart/form-data, all files at once, preserving folder structure, with zipName)
  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedLecture) {
      setError("Please select a lecture.");
      return;
    }
    if (!zipName.trim()) {
      setError("Please enter a zip file name.");
      return;
    }
    if (!files.length) {
      setError("Please select at least one file or folder.");
      return;
    }
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("zipName", zipName.trim());
      files.forEach((file) => {
        formData.append("files", file, file.webkitRelativePath || file.name);
      });
      const res = await fetch(
        `${API_BASE}/assets/upload?lectureId=${encodeURIComponent(selectedLecture)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const data = await res.json();
      if (res.ok) {
        setSuccess(
          data && data.name
            ? `Zip "${data.name}" uploaded successfully!`
            : "Upload successful!"
        );
        setFiles([]);
        setZipName("");
        fetchAssets();
      } else {
        setError(data.message || "Upload failed.");
      }
    } catch (err) {
      setError("Upload failed.");
    }
    setUploading(false);
  };

  // Download asset
  const handleDownload = (assetId) => {
    const token = localStorage.getItem("token");
    window.open(`${API_BASE}/assets/download/${assetId}?token=${token}`, "_blank");
  };

  // Delete asset
  const handleDelete = async (assetId) => {
    if (!window.confirm("Are you sure you want to delete this asset? This cannot be undone.")) return;
    setDeletingId(assetId);
    setError("");
    setSuccess("");
    try {
      const res = await fetchWithAuth(`${API_BASE}/assets/${assetId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || "Asset deleted successfully.");
        setAssets((prev) => prev.filter((a) => a._id !== assetId));
      } else {
        setError(data.message || "Delete failed.");
      }
    } catch (err) {
      setError("Delete failed.");
    }
    setDeletingId(null);
  };

  // Filter assets by search
  const filteredAssets = assets.filter((asset) => {
    const lectureTitle =
      lectures.find((l) => l._id === asset.lectureId)?.title || "";
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
    <div className="publish-asset-container" style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <h2 style={{ marginBottom: 12 }}>Publish Asset</h2>
      <p style={{ marginBottom: 24 }}>Upload and manage assets here. All files will be zipped before upload.</p>

      <form onSubmit={handleUpload} style={{ marginBottom: 32, background: "#f9f9f9", padding: 18, borderRadius: 8 }}>
        <div style={{ marginBottom: 14 }}>
          <label>
            <b>Lecture:</b>{" "}
            <select
              value={selectedLecture}
              onChange={(e) => setSelectedLecture(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid #ccc" }}
              required
            >
              <option value="">Select a lecture</option>
              {lectures.map((lec) => (
                <option key={lec._id} value={lec._id}>
                  {lec.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label>
            <b>Zip File Name:</b>{" "}
            <input
              type="text"
              value={zipName}
              onChange={(e) => setZipName(e.target.value)}
              placeholder="e.g. lecture-assets.zip"
              style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid #ccc", width: 220, marginLeft: 8 }}
              required
            />
            <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>
              (Required. Will be the name of the uploaded zip file. ".zip" will be added if missing.)
            </span>
          </label>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label>
            <b>Drag and Drop Files:</b>{" "}
            <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: 20, borderRadius: 8 }}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop up to 20 files here, or click to select files</p>
            </div>
            <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>
              (You can select up to 20 files.)
            </span>
          </label>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label>
            <b>Select Folder:</b>{" "}
            <input
              type="file"
              webkitdirectory="true"
              onChange={handleFileChange}
              disabled={files.length > 0 && !isFolderSelected}
              style={{ display: 'block', marginTop: 8 }}
            />
            <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>
              (Select a folder to upload. Folder structure will be preserved.)
            </span>
          </label>
        </div>
        {files.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 13, color: "#444" }}>
            <b>Selected:</b>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {files.slice(0, 5).map((file, idx) => (
                <li key={idx}>
                  {file.webkitRelativePath || file.name}
                </li>
              ))}
              {files.length > 5 && <li>...and {files.length - 5} more</li>}
            </ul>
          </div>
        )}
        <button
          type="submit"
          disabled={uploading}
          style={{
            background: "#2d8cff",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            padding: "8px 18px",
            fontWeight: 600,
            cursor: uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
        {success && <div style={{ color: "green", marginTop: 10 }}>{success}</div>}
      </form>

      <h3 style={{ marginBottom: 10 }}>Uploaded Assets</h3>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by name, lecture, or uploader..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 5,
            border: "1px solid #ccc",
            fontSize: 15,
            marginBottom: 4,
          }}
        />
      </div>
      {loadingAssets ? (
        <div>Loading assets...</div>
      ) : filteredAssets.length === 0 ? (
        <div>No assets uploaded yet.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
          <thead>
            <tr style={{ background: "#f0f4fa" }}>
              <th style={{ padding: 8, border: "1px solid #eee" }}>Name</th>
              <th style={{ padding: 8, border: "1px solid #eee" }}>Lecture</th>
              <th style={{ padding: 8, border: "1px solid #eee" }}>Uploader</th>
              <th style={{ padding: 8, border: "1px solid #eee" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset._id}>
                <td style={{ padding: 8, border: "1px solid #eee" }}>{asset.name}</td>
                <td style={{ padding: 8, border: "1px solid #eee" }}>
                  {lectures.find((l) => l._id === asset.lectureId)?.title || asset.lectureId}
                </td>
                <td style={{ padding: 8, border: "1px solid #eee" }}>
                  {asset.uploadedBy?.name || "Unknown"}
                </td>
                <td style={{ padding: 8, border: "1px solid #eee", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => handleDownload(asset._id)}
                    style={{
                      background: "#2d8cff",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      padding: "5px 12px",
                      cursor: "pointer",
                      marginRight: 8,
                    }}
                  >
                    Download
                  </button>
                  <a
                    href={asset.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#2d8cff",
                      textDecoration: "underline",
                      marginLeft: 0,
                      marginRight: 8,
                    }}
                  >
                    View
                  </a>
                  {currentUser.isAdmin && (
                    <button
                      onClick={() => handleDelete(asset._id)}
                      disabled={deletingId === asset._id}
                      style={{
                        background: "#ff4d4f",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "5px 12px",
                        cursor: deletingId === asset._id ? "not-allowed" : "pointer",
                      }}
                    >
                      {deletingId === asset._id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>
  );
};

export default PublishAsset;
