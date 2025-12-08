import { useState } from 'react';
import { useEffect } from 'react';

import blueMark from '../../img/fdimage/blueMark.svg';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_BASEURL;

const PrivateOnlineTutor = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        goals: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE}/private-tutor/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Redirect to success page
                window.location.href = `${API_BASE}/tutor-request-success`;
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to submit request');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className='privateOnlineTutor-container'>
            <div className="private-online-tutor-datails">
                <h2>Need a Private Online Tutor?</h2>
                <p>Get personalized one-on-one tutoring sessions tailored to your learning needs and schedule.</p>

                <div className="features">
                    <div>
                        <img src={blueMark} alt="" />
                        <span>Personalized learning plans</span>
                    </div>
                    <div>
                        <img src={blueMark} alt="" />
                        <span>Flexible scheduling</span>
                    </div>
                    <div>
                        <img src={blueMark} alt="" />
                        <span>Expert instructors</span>
                    </div>
                    <div>
                        <img src={blueMark} alt="" />
                        <span>Progress tracking</span>
                    </div>
                </div>

                <Link to="/private-tutor">Request a Tutor</Link>
            </div>
            <div id="private-online-tutor-form-section">
                <form onSubmit={handleSubmit}>
                    {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
                    
                    <input 
                        type="text" 
                        name="name"
                        placeholder='Your Name' 
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="email" 
                        name="email"
                        placeholder='Your Email' 
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="text" 
                        name="phone"
                        placeholder='Your Phone' 
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    <select 
                        name="subject" 
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Subject</option>
                        <option value="Data Analysis with Python">Data Analysis with Python</option>
                        <option value="Copy Writing">Copy Writing</option>
                        <option value="Responsive Web Design">Responsive Web Design</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Content Creation">Content Creation</option>
                        <option value="Mobile Dev with React-native">Mobile Dev with React-native</option>
                        <option value="Data Analysis with Excel">Data Analysis with Excel</option>
                    </select>
                    <textarea 
                        name="goals" 
                        cols="30" 
                        rows="10" 
                        placeholder='Tell us about your learning goals'
                        value={formData.goals}
                        onChange={handleChange}
                        required
                    ></textarea>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PrivateOnlineTutor;