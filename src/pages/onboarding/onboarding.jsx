import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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

//Whatsapp imge
import WhatsAppImage from "../../img/whatapp-removebg-preview.png"

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
    course: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage('');
      }, 6000); // 6 seconds
  
      return () => clearTimeout(timer); // Cleanup on unmount or when message changes
    }
  }, [responseMessage]);

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
    setResponseMessage(''); // Clear any previous messages

    // validations 
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.course) newErrors.course = 'Please select a course';
    if (!formData.countryCode) newErrors.countryCode = 'Please select a country code';

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      setResponseMessage('Please fill in all required fields');
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.focus();
      }
      setIsLoading(false);
      return;
    }

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
        setResponseMessage('Registration successful! Redirecting...');
        // Reset form
        setFormData({
          name: '',
          email: '',
          countryCode: '+234',
          course: '',
          phone: ''
        });
        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate('/onboarding-home');
        }, 1500);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to submit form. Please try again.';
      setResponseMessage(errorMsg);
      toast.error(errorMsg);
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="onboarding-linear">
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
                  value={formData.name}
                  onChange={handleInputChange}
                  className={error.name ? 'error form-input' : 'form-input'}
                />
                {error.name && <p className="error-message">{error.name}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={error.email ? 'error form-input' : 'form-input'}
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {error.email && <p className="error-message">{error.email}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="phone" id="onboarding-w-p"><img src={WhatsAppImage} alt="Myteacher Whatsapp png" loading="lazy" />Whatsapp Number:</label>
                <div style={{ display: 'flex' }}>
                  <select
                    name="countryCode"
                    className={error.countryCode ? 'error form-input' : 'form-input'}
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    style={{
                      width: '180px', // Slightly wider to accommodate longer country names
                      height: 'auto',
                      marginRight: '10px',
                      border: '1px solid #000',
                      borderRadius: '4px',
                      padding: '0 8px'
                    }}
                  >
                    <optgroup label="Africa">
                      <option value="+27">South Africa (+27)</option>
                      <option value="+234">Nigeria (+234)</option>
                      <option value="+233">Ghana (+233)</option>
                      <option value="+20">Egypt (+20)</option>
                      <option value="+212">Morocco (+212)</option>
                      <option value="+254">Kenya (+254)</option>
                    </optgroup>
                    <optgroup label="Americas">
                      <option value="+1">USA/Canada (+1)</option>
                      <option value="+55">Brazil (+55)</option>
                      <option value="+52">Mexico (+52)</option>
                      <option value="+54">Argentina (+54)</option>
                    </optgroup>
                    <optgroup label="Asia">
                      <option value="+91">India (+91)</option>
                      <option value="+86">China (+86)</option>
                      <option value="+81">Japan (+81)</option>
                      <option value="+82">South Korea (+82)</option>
                      <option value="+65">Singapore (+65)</option>
                    </optgroup>
                    <optgroup label="Europe">
                      <option value="+44">UK (+44)</option>
                      <option value="+33">France (+33)</option>
                      <option value="+49">Germany (+49)</option>
                      <option value="+39">Italy (+39)</option>
                      <option value="+34">Spain (+34)</option>
                    </optgroup>
                    <optgroup label="Oceania">
                      <option value="+61">Australia (+61)</option>
                      <option value="+64">New Zealand (+64)</option>
                    </optgroup>
                    <optgroup label="Middle East">
                      <option value="+971">UAE (+971)</option>
                      <option value="+966">Saudi Arabia (+966)</option>
                    </optgroup>
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className={error.phone ? 'error form-input' : 'form-input'}
                    style={{ flex: 1 }}
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  {error.phone && <p className="error-message">{error.phone}</p>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Course of Interest:</label>
                <select
                  name="course"
                  className={error.course ? 'error form-input' : 'form-input'}
                  value={formData.course}
                  onChange={handleInputChange}
                  style={{
                    width: '100%', // Slightly wider to accommodate longer country names
                    height: 'auto',
                    marginRight: '10px',
                    border: '1px solid #000',
                    borderRadius: '4px',
                    padding: '15px 8px'
                  }}
                >
                  <option value="">Select Course</option>
                  <option value="Basic Computing">Basic Computing</option>
                  <option value="Virtual Assistant">Virtual Assistant</option>
                  <option value="Data Entry">Data Entry</option>
                  <option value="Content Creation">Content Creation</option>
                  <option value="Copy Right">Copy Right</option>
                  <option value="TikTok Ads">TikTok Ads</option>
                  <option value="Instagram Ads">Instagram Ads</option>
                  <option value="Facebook Ads">Facebook Ads</option>
                  <option value="Social Media Marketing">Social Media Marketing</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                </select>
                {error.course && <p className="error-message">{error.course}</p>}
              </div>
              {/* Response messsage */}
              {/* Response message with auto-dismiss after 6 seconds */}
              {responseMessage && (
                <p
                  className={`response-message ${responseMessage.includes('success') ? 'success' : 'error'}`}
                  key={Date.now()} // Force re-render when message changes
                >
                  {responseMessage}
                </p>
              )}
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
    </div>
  );
};

export default Onboarding;