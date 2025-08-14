import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../../assets/styles/admin/upcomingLectureBatch.css';
import { AuthContext } from "../../../context/Authcontext";
import { CourseContext } from "../../../context/CourseContext";

const API_BASE = import.meta.env.VITE_BASEURL;

const UpcomingLectureBatchCreation = () => {
  const { user } = useContext(AuthContext);
  const { courses } = useContext(CourseContext);
  
  // Create a memoized map of courses for efficient lookups
  const courseMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(courses)) {
      courses.forEach(course => {
        if (course?._id) {
          map.set(course._id, course);
        }
      });
    }
    return map;
  }, [courses]);

  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    courseDescription: '',
    courseIntructor: user?.name || '',
    startTime: '',
    platform: '',
    linkedLecture: '',
    courseImage: null
  });
  
  const [batches, setBatches] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [fetchingLectures, setFetchingLectures] = useState(false);
  const navigate = useNavigate();

  // Fetch all batches and lectures on component mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchBatches();
      await fetchLectures();
    };
    fetchData();
  }, []);

  // Fetch lectures from API
  const fetchLectures = async () => {
    setFetchingLectures(true);
    try {
      console.log('Fetching lectures from:', `${API_BASE}/lectures/lectures`);
      const response = await axios.get(`${API_BASE}/lectures/lectures`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      console.log('Lectures API response:', response.data);
      console.log('Raw API response:', response);
console.log('Response data type:', typeof response.data);
console.log('Response data keys:', Object.keys(response.data));
      
      // Extract the lectures array from the response data
      const lecturesData = response.data?.lectures || [];
      console.log('Processed lectures data:', lecturesData);
      
      setLectures(Array.isArray(lecturesData) ? lecturesData : []);
      
    } catch (error) {
      console.error('Error fetching lectures:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      toast.error('Failed to load lectures');
      setLectures([]);
    } finally {
      setFetchingLectures(false);
    }
  };

  // Fetch all batches on component mount
  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${API_BASE}/upcomingLectureBatch`);
      setBatches(response.data);
    } catch (error) {
      toast.error('Failed to fetch batches. Please try again later.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Error fetching batches:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        courseImage: file
      }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form data to FormData
      Object.keys(formData).forEach(key => {
        // Skip courseImage as it's handled separately
        if (key === 'courseImage') return;
        
        // Only append if the value is not null or undefined
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Handle file upload if present
      if (formData.courseImage instanceof File) {
        formDataToSend.append('courseImage', formData.courseImage);
      }

      // Handle linkedLecture specifically to match backend expectations
      if (!formData.linkedLecture || formData.linkedLecture === '') {
        formDataToSend.set('linkedLecture', 'null'); // Send as string 'null' for the backend to parse
      }

      let response;
      if (editingId) {
        response = await axios.put(`${API_BASE}/upcomingLectureBatch/${editingId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Batch updated successfully!');
      } else {
        response = await axios.post(`${API_BASE}/upcomingLectureBatch/create`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Batch created successfully!');
      }
      
      console.log('API Response:', response.data);
      resetForm();
      fetchBatches();
    } catch (error) {
      console.error('Error saving batch:', error);
      toast.error(error.response?.data?.message || 'Failed to save batch. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (batch) => {
    const selectedCourse = courseMap.get(batch.courseId);
    setFormData({
      courseId: batch.courseId,
      courseName: selectedCourse?.title || batch.courseName,
      courseDescription: batch.courseDescription,
      courseIntructor: batch.courseIntructor,
      startTime: new Date(batch.startTime).toISOString().slice(0, 16),
      platform: batch.platform,
      linkedLecture: batch.linkedLecture || '',
      courseImage: null
    });
    setImagePreview(batch.courseImage || '');
    setEditingId(batch._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        setLoading(true);
        const response = await axios.delete(`${API_BASE}/upcomingLectureBatch/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200) {
          toast.success('Batch deleted successfully!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          await fetchBatches();
        } else {
          throw new Error(response.data?.message || 'Failed to delete batch');
        }
      } catch (error) {
        console.error('Error deleting batch:', error);
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to delete batch. Please try again.';
        
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      courseId: '',
      courseName: '',
      courseDescription: '',
      courseIntructor: user?.name || '',
      startTime: '',
      platform: '',
      linkedLecture: '',
      courseImage: null
    });
    setImagePreview('');
    setEditingId(null);
    const fileInput = document.getElementById('courseImage');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="lecture-batch-container">
      <h2>{editingId ? 'Edit' : 'Create New'} Upcoming Lecture Batch</h2>
      
      <form onSubmit={handleSubmit} className="batch-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Select Course *</label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
              disabled={!!editingId}
              className="course-select"
              aria-label="Select a course"
            >
              <option value="">Select a course</option>
              {Array.from(courseMap.values()).map(course => {
                const courseId = course._id;
                const courseTitle = course.course || 'Untitled Course';
                return (
                  <option 
                    key={courseId} 
                    value={courseId}
                    data-title={courseTitle}
                    data-description={course.courseDescription || ''}
                  >
                    {courseTitle} {/*(ID: {courseId})*/}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div className="form-group">
            <label>Course Name *</label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              required
            //   readOnly
            //   className="readonly-input"
            />
          </div>
          
          <div className="form-group">
            <label>Instructor *</label>
            <input
              type="text"
              name="courseIntructor"
              value={formData.courseIntructor}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Start Time *</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Platform *</label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              required
            >
              <option value="">Select Platform</option>
              <option value="Zoom">Zoom</option>
              <option value="Google Meet">Google Meet</option>
              <option value="Microsoft Teams">Microsoft Teams</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group full-width">
            <label>Course Description *</label>
            <textarea
              name="courseDescription"
              value={formData.courseDescription}
              onChange={handleChange}
              rows="4"
              required
            //   readOnly
            //   className="readonly-input"
            />
          </div>
          
          <div className="form-group">
            <label>Linked Lecture (Optional)</label>
            <select
              name="linkedLecture"
              value={formData.linkedLecture}
              onChange={handleChange}
              className="form-control"
              disabled={fetchingLectures}
            >
              <option value="">Select a lecture (optional)</option>
              {Array.isArray(lectures) && lectures.length > 0 &&
                lectures.map((lecture) => (
                  <option key={lecture._id} value={lecture._id}>
                    {lecture.title || `Lecture ${lecture._id}`}
                  </option>
                ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Course Image</label>
            <input
              type="file"
              id="courseImage"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : editingId ? 'Update Batch' : 'Create Batch'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <div className="batches-list">
        <h3>Upcoming Lecture Batches</h3>
        {batches.length === 0 ? (
          <p>No upcoming lecture batches found.</p>
        ) : (
          <div className="batch-cards">
            {batches.map(batch => (
              <div key={batch._id} className="batch-card">
                {batch.courseImage && (
                  <div className="batch-image">
                    <img src={batch.courseImage} alt={batch.courseName} />
                  </div>
                )}
                <div className="batch-details">
                  <h4>{batch.courseName}</h4>
                  <p><strong>ID:</strong> {batch.courseId}</p>
                  <p><strong>Instructor:</strong> {batch.courseIntructor}</p>
                  <p><strong>Starts:</strong> {new Date(batch.startTime).toLocaleString()}</p>
                  <p><strong>Platform:</strong> {batch.platform}</p>
                  <p><strong>Linked Lecture:</strong> {batch.linkedLecture}</p>
                  <p className="batch-description">{batch.courseDescription}</p>
                  {console.log(batch)}
                  <div className="batch-actions">
                    <button 
                      onClick={() => handleEdit(batch)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(batch._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingLectureBatchCreation;