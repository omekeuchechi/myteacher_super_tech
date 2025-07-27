import React, { useState, useEffect, useCallback } from 'react';

import { toast } from 'react-toastify';
import '../../assets/styles/admin/createAssignment.css';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000";

const CreateAssignment = () => {
    const [lectures, setLectures] = useState([]);
    const [createdAssignments, setCreatedAssignments] = useState([]);
    const [formData, setFormData] = useState({
        lectureId: '',
        assignmentName: '',
        assignmentDescription: '',
        expiringDate: '',
        submitType: 'file'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const token = localStorage.getItem('token');

    const fetchMyListedLectures = useCallback(async () => {
        setIsFetching(true);
        try {
            const response = await fetch(`${API_BASE}/assignments/my-listed-lectures`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setLectures(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch lectures.');
            }
        } catch (error) {
            toast.error('Failed to fetch lectures.');
            console.error('Error fetching lectures:', error);
        } finally {
            setIsFetching(false);
        }
    }, [token]);

    const fetchCreatedAssignments = useCallback(async () => {
        setIsFetching(true);
        try {
            const response = await fetch(`${API_BASE}/assignments/my-created-assignments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setCreatedAssignments(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch created assignments.');
            }
        } catch (error) {
            toast.error('Failed to fetch created assignments.');
            console.error('Error fetching created assignments:', error);
        } finally {
            setIsFetching(false);
        }
    }, [token]);

    useEffect(() => {
        fetchMyListedLectures();
        fetchCreatedAssignments();
    }, [fetchMyListedLectures, fetchCreatedAssignments]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.lectureId) {
            toast.error('Please select a lecture.');
            return;
        }
        setIsLoading(true);
        try {
            const { lectureId, ...assignmentData } = formData;
            const response = await fetch(`${API_BASE}/assignments/lectures/${lectureId}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(assignmentData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('Assignment created successfully!');
                setFormData({
                    lectureId: '',
                    assignmentName: '',
                    assignmentDescription: '',
                    expiringDate: '',
                    submitType: 'file'
                });
                fetchCreatedAssignments(); // Refresh the list
            } else {
                throw new Error(data.message || 'Failed to create assignment.');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while creating the assignment.');
            console.error('Error creating assignment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-assignment-container">
            <div className="create-assignment-form-section">
                <h2>Create New Assignment</h2>
                <form onSubmit={handleSubmit} className="assignment-form">
                    <div className="form-group">
                        <label htmlFor="lectureId">Target Lecture/Batch</label>
                        <select
                            id="lectureId"
                            name="lectureId"
                            value={formData.lectureId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select a Lecture --</option>
                            {lectures.map(lecture => (
                                <option key={lecture._id} value={lecture._id}>{lecture.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="assignmentName">Assignment Name</label>
                        <input
                            type="text"
                            id="assignmentName"
                            name="assignmentName"
                            value={formData.assignmentName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="assignmentDescription">Description</label>
                        <textarea
                            id="assignmentDescription"
                            name="assignmentDescription"
                            value={formData.assignmentDescription}
                            onChange={handleChange}
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="expiringDate">Due Date</label>
                        <input
                            type="datetime-local"
                            id="expiringDate"
                            name="expiringDate"
                            value={formData.expiringDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="submitType">Submission Type</label>
                        <select
                            id="submitType"
                            name="submitType"
                            value={formData.submitType}
                            onChange={handleChange}
                        >
                            <option value="file">File Upload</option>
                            <option value="text">Text Entry</option>
                            <option value="both">Website URL</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Assignment'}
                    </button>
                </form>
            </div>

            <div className="created-assignments-section">
                <h2>My Created Assignments</h2>
                {isFetching ? <p>Loading assignments...</p> : (
                    <div className="assignments-list">
                        {createdAssignments.length > 0 ? (
                            createdAssignments.map(assignment => (
                                <div key={assignment._id} className="assignment-card">
                                    <h3>{assignment.assignmentName}</h3>
                                    <p><strong>Batch:</strong> {assignment.targetBatch?.title || 'N/A'}</p>
                                    <p><strong>Due:</strong> {new Date(assignment.expiringDate).toLocaleString()}</p>
                                    <p><strong>Submissions:</strong> {assignment.submissions?.length || 0}</p>
                                </div>
                            ))
                        ) : (
                            <p>You have not created any assignments yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateAssignment;
