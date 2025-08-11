import React from 'react';
import registerIcon from '../../assets/svg/registration.png';
import liveIcon from '../../assets/svg/onlineClass.png';
import libraryIcon from '../../assets/svg/Resource.png';
import certificationIcon from '../../assets/svg/Certification.png';

import { Link, useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();
  const features = [
    {
      id: 1,
      title: 'Easy Registration',
      description: 'Create your account and get instant access to your personalized dashboard.',
      icon: registerIcon
    },
    {
      id: 2,
      title: 'Live Online Classes',
      description: 'Learn directly from certified instructors in real time.',
      icon: liveIcon
    },
    {
      id: 3,
      title: 'Resource Library',
      description: 'Download materials, access class recordings, and revisit learning anytime.',
      icon: libraryIcon
    },
    {
      id: 4,
      title: 'Certification',
      description: 'Earn a certificate upon successful completion of any programme.',
      icon: certificationIcon
    }
  ];

  return (
    <div className="features-section" aria-labelledby="features-heading">
      <h2 id="features-heading" style={{ fontFamily: 'verdana', fontWeight: 900, fontSize: 34 }}>Start Learning Online the Smarter Way</h2>
      <p className="section-subtext" style={{ fontFamily: 'verdana', fontWeight: 900 }}>
        Whether you are building a business, looking for a job, growing your career or want to start earning online. Then getting a digital skill is important for everyone. You can get these skills from anywhere at your comfort.
      </p>
      
      <div className="features-grid">
        {features.map((feature) => (
          <div key={feature.id} className="feature-card" data-testid={`feature-card-${feature.id}`}>
            <div className="feature-icon">
              <img src={feature.icon} alt={feature.title} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
      
      <button className="btn-secondary" aria-label="Get started with our learning platform" onClick={() => navigate('/auth')}>
        Get Started Now — Register and Enroll in Minutes
      </button>
    </div>
  );
};

export default Features;