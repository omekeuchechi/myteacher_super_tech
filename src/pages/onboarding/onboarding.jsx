import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pusher from 'pusher-js';
import Nav from "../../components/nav";
import myteacherLogo from "../../img/Untitled-1.png";
import onboardingImage from "../../img/onboarding_side_image.jpg";
import onboardingImage2 from "../../img/Myteacher_telegram.jpg";
import onboardingImage3 from "../../assets/illustrations/dashboard/myteacher-graphic-designer.jpg";
import "./onboarding.css";

const API_BASE = import.meta.env.VITE_BASEURL;
const PUSHER_APP_KEY = import.meta.env.VITE_PUSHER_KEY;
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || 'mt1';

// Initialize Pusher
const pusher = new Pusher(PUSHER_APP_KEY, {
  cluster: PUSHER_CLUSTER,
  encrypted: true
});

const onboardingData = [
  {
    title: "Join Our Online Community",
    description: "Join our online community and connect with other students and professionals. Our community is a great place to ask questions, share knowledge, and get help with any issues you may have.",
    image: onboardingImage
  },
  {
    title: "Join our Telegram Community",
    description: "By filling this form you will be able to join our Telegram community.",
    image: onboardingImage2
  },
  {
    title: "Myteacher Graphic Designers",
    description: "Myteacher Graphic Designers are the best in the industry.",
    image: onboardingImage3
  }
];

const Onboarding = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+234',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  // Handle slider auto-transition
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (!isPaused) {
      resetTimeout();
      timeoutRef.current = setTimeout(
        () => setCurrentIndex((prevIndex) => 
          prevIndex === onboardingData.length - 1 ? 0 : prevIndex + 1
        ),
        5000
      );
    }
    return () => resetTimeout();
  }, [currentIndex, isPaused]);

  // Subscribe to Pusher channel when component mounts
  useEffect(() => {
    // Only subscribe in admin context
    if (window.location.pathname.includes('admin')) {
      const channel = pusher.subscribe('onboarding');
      
      channel.bind('new-submission', (data) => {
        toast.info(`New submission from ${data.name}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

      // Cleanup subscription on unmount
      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/onboarding/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Thank you for your submission! We will contact you soon.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          countryCode: '+234',
          phone: ''
        });
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit form. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding">
        <div className="onboarding-header">
          <img src={myteacherLogo} alt="myteacher-logo" />
          <h1>Myteacher Institute</h1>
        </div>
        <fieldset className="onboarding-form">
          <legend>Onboarding Form</legend>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <div style={{ display: 'flex' }}>
                <select
                  name="countryCode"
                  className="form-input"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  style={{
                    width: '120px',
                    marginRight: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '0 8px'
                  }}
                >
                  <option value="+234">Nigeria (+234)</option>
                  <option value="+44">UK (+44)</option>
                  <option value="+1">USA (+1)</option>
                  <option value="+233">Ghana (+233)</option>
                  <option value="+27">South Africa (+27)</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Get Started'}
            </button>
          </form>
        </fieldset>
      </div>
      <div
        className="onboarding-slider"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="slider-container"
          style={{ transform: `translate3d(${-currentIndex * 100}%, 0, 0)` }}
        >
          {onboardingData.map((item, index) => (
            <div key={index} className="slide">
              <div className="image-container">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="slide-content">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="slider-dots">
          {onboardingData.map((_, idx) => (
            <div
              key={idx}
              className={`dot ${currentIndex === idx ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;