import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css'; // Create this CSS file for styling

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000";

const InstructorAuth = () => {
    const [formData, setFormData] = useState({
        passCode: '',
        password: '',
        termsAccepted: false,
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.passCode || !formData.password) {
            return setError('Passcode and password are required');
        }

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        if (formData.password.length < 8) {
            return setError('Password must be at least 8 characters long');
        }

        if (!formData.termsAccepted) {
            return setError('You must accept the terms and conditions');
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/user/instructorAuth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    passCode: formData.passCode,
                    password: formData.password,
                    termsAccepted: formData.termsAccepted
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create instructor account');
            }

            // Save token to localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);
                // Save user data if needed
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                setSuccess('Account created successfully! Redirecting to login page...');
                // Redirect to instructor dashboard after a short delay
                setTimeout(() => {
                    navigate('/instructor/login');
                }, 2000);
            }
        } catch (err) {
            console.error('Instructor auth error:', err);
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Instructor Account Setup</h2>
                <p className="auth-subtitle">Set up your instructor account using your unique passcode</p>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="passCode">Passcode</label>
                        <input
                            type="text"
                            id="passCode"
                            name="passCode"
                            value={formData.passCode}
                            onChange={handleChange}
                            placeholder="Enter your unique passcode"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            required
                            minLength="8"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                            minLength="8"
                        />
                    </div>

                    <div className="Terms-group">
                        <label>
                            <input
                                type="checkbox"
                                id="checkBox"
                                name="termsAccepted"
                                checked={formData.termsAccepted}
                                onChange={handleChange}
                                style={{ marginRight: '8px' }}
                            />
                            I accept the{' '}
                            <Link to="/terms" target="_blank" style={{ color: '#4a6ee0' }}>
                                Terms and Conditions
                            </Link>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account? <Link to="/instructor/login">Sign in here</Link>
                    </p>
                    <p>
                        Need help? <Link to="/help">Contact support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InstructorAuth;