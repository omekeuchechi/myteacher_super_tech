import React, { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const SuperAdminList = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAdmins = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/admin/admins`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to fetch admins');
            }
            const data = await response.json();
            setAdmins(data.admins || []);
        } catch (err) {
            setError(err.message);
            toast.error(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const handleAdminAction = async (action, userId, successMessage) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/admin/${action}/${userId}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Action failed');
            }
            toast.success(successMessage);
            fetchAdmins(); // Re-fetch to update the list
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        }
    };

    const handleDeleteAdmin = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this admin? This action is permanent.')) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/admin/admins/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to delete admin');
            }
            toast.success('Admin deleted successfully.');
            fetchAdmins();
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        }
    };

    const makeSuperAdmin = (userId) => handleAdminAction('make-super-admin', userId, 'User promoted to Super Admin!');
    const suspendAdmin = (userId) => handleAdminAction('admins/suspend', userId, 'Admin has been suspended.');
    const unsuspendAdmin = (userId) => handleAdminAction('admins/unsuspend', userId, 'Admin has been unsuspended.');

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <ToastContainer position="top-right" autoClose={3000} />
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Management</h1>
            <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 mb-6 border rounded-lg"
            />
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAdmins.map(admin => (
                            <tr key={admin._id} className="hover:bg-gray-50">
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-10 h-10">
                                            <img className="w-full h-full rounded-full" src={admin.avatar || `https://i.pravatar.cc/150?u=${admin._id}`} alt={admin.name} />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-gray-900 whitespace-no-wrap font-semibold">{admin.name}</p>
                                            <p className="text-gray-600 whitespace-no-wrap">{admin.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${admin.isSuperAdmin ? 'text-purple-900' : 'text-green-900'}`}>
                                        <span aria-hidden className={`absolute inset-0 ${admin.isSuperAdmin ? 'bg-purple-200' : 'bg-green-200'} opacity-50 rounded-full`}></span>
                                        <span className="relative">{admin.isSuperAdmin ? 'Super Admin' : 'Admin'}</span>
                                    </span>
                                    {admin.isSuspended && (
                                        <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight ml-2">
                                            <span aria-hidden className={`absolute inset-0 bg-red-200 opacity-50 rounded-full`}></span>
                                            <span className="relative">Suspended</span>
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm space-x-2">
                                    {!admin.isSuperAdmin && <button onClick={() => makeSuperAdmin(admin._id)} className="text-purple-600 hover:text-purple-900">Make Super</button>}
                                    {admin.isSuspended ? 
                                        <button onClick={() => unsuspendAdmin(admin._id)} className="text-green-600 hover:text-green-900">Unsuspend</button> : 
                                        <button onClick={() => suspendAdmin(admin._id)} className="text-yellow-600 hover:text-yellow-900">Suspend</button>}
                                    <button onClick={() => handleDeleteAdmin(admin._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SuperAdminList;
