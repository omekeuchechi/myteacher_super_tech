import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/Authcontext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Editor } from '@tinymce/tinymce-react';
import '../../assets/styles/admin/postblog.css';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const PostBlog = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(['Technology', 'Education', 'News', 'Tutorials']);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    tags: '',
    featuredImage: null,
    images: []
  });
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/');
      toast.error('Unauthorized access');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => 
      file.type.match('image/.*') && 
      file.size <= 100 * 1024 * 1024 // 100MB limit
    );

    if (imageFiles.length !== files.length) {
      toast.warning('Some files were not images or exceeded size limit');
    }

    if (imageFiles.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...imageFiles] 
      }));

      // Create preview URLs
      const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    const newPreviews = [...previewImages];
    
    URL.revokeObjectURL(newPreviews[index]); // Clean up memory
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFormData(prev => ({ ...prev, images: newImages }));
    setPreviewImages(newPreviews);
  };

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setFormData(prev => ({ ...prev, featuredImage: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.content) {
      toast.error('Title, category, and content are required');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('content', formData.content);
      
      // Add tags as comma-separated string
      if (formData.tags) {
        formDataToSend.append('tags', formData.tags);
      }

      // Add featured image if exists
      if (formData.featuredImage) {
        formDataToSend.append('featuredImage', formData.featuredImage);
      }

      // Add additional images
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image, index) => {
          formDataToSend.append('images', image);
        });
      }

      const response = await fetch(`${API_BASE}/posts/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Let the browser set the Content-Type with boundary
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      toast.success('Post created successfully!');
      navigate('/tech-blog');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-blog-container">
      <h2>Create New Blog Post</h2>
      
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Post Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter post title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFeaturedImageChange}
            className="file-input"
          />
          {formData.featuredImage && (
            <div className="image-preview">
              <img 
                src={URL.createObjectURL(formData.featuredImage)} 
                alt="Featured preview" 
                className="preview-image"
              />
              <button 
                type="button" 
                onClick={() => {
                  setFormData(prev => ({ ...prev, featuredImage: null }));
                  URL.revokeObjectURL(formData.featuredImage);
                }}
                className="remove-image-btn"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Additional Images (Optional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="file-input"
          />
          <div className="image-previews">
            {previewImages.map((preview, index) => (
              <div key={index} className="preview-item">
                <img 
                  src={preview} 
                  alt={`Preview ${index}`} 
                  className="preview-image"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="remove-image-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Content *</label>
          <div className="editor-container">
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={formData.content}
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family: Arial, sans-serif; font-size: 14px; }',
                branding: false,
                images_upload_handler: function (blobInfo, success, failure) {
                  const formData = new FormData();
                  formData.append('file', blobInfo.blob(), blobInfo.filename());

                  fetch(`${API_BASE}/post_files/upload-image`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                  })
                  .then(response => response.json())
                  .then(result => {
                    if (result.success) {
                      success(result.url);
                    } else {
                      failure('Image upload failed');
                    }
                  })
                  .catch(() => {
                    failure('Image upload failed');
                  });
                }
              }}
              onEditorChange={handleEditorChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/techblog')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostBlog;