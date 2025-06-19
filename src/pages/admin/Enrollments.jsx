import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const Enrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                const response = await fetch(`${API_BASE}/enrollment/list`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch enrollments');
                }

                const data = await response.json();
                const enrollmentsWithAvatar = data.enrollments.map(enrollment => {
                    if (enrollment.userId) {
                        enrollment.userId.avatar = enrollment.userId.avatar || null;
                    }
                    return enrollment;
                });
                setEnrollments(enrollmentsWithAvatar || []);
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p>Loading enrollments...</p></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen"><p className="text-red-500">Error: {error}</p></div>;
    }

    const filteredEnrollments = enrollments.filter(enrollment => {
        const term = searchTerm.toLowerCase();
        const studentName = enrollment.userId?.name?.toLowerCase() || '';
        const studentEmail = enrollment.userId?.email?.toLowerCase() || '';
        const courseName = enrollment.courseId?.course?.toLowerCase() || '';
        return studentName.includes(term) || studentEmail.includes(term) || courseName.includes(term);
    });

    const processedEnrollments = filteredEnrollments
        .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
        .slice(0, 200);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Course Enrollments</h1>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name, email, or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {processedEnrollments.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-500">No matching enrollments found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {processedEnrollments.map((enrollment) => (
                        <div key={enrollment._id} className="bg-white shadow-lg rounded-xl p-5 flex flex-col sm:flex-row items-center sm:space-x-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
                            <div className="flex-shrink-0 mb-4 sm:mb-0">
                                {enrollment.userId?.avatar ? (
                                    <img
                                        src={enrollment.userId.avatar}
                                        alt={enrollment.userId.name}
                                        className="w-20 h-20 rounded-full object-cover border-4 border-indigo-300"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-2xl">
                                        <span>
                                            {enrollment.userId?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <div className="font-bold text-xl text-gray-900">{enrollment.userId?.name || 'Unknown User'}</div>
                                <div className="text-sm text-gray-500 mt-1">{enrollment.userId?.email || 'No email provided'}</div>
                                <div className="mt-3">
                                    <span className="text-sm font-semibold text-gray-600">Course:</span>
                                    <span className="ml-2 text-md font-medium text-indigo-700">{enrollment.courseId?.course || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="text-center sm:text-right mt-4 sm:mt-0">
                                <span className="text-xs text-gray-400">Enrolled on</span>
                                <div className="text-sm font-semibold text-gray-600">{new Date(enrollment.enrolledAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Enrollments;