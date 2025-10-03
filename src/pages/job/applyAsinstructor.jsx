    import { Link } from "react-router-dom";
    import { useState } from "react";
    import "./applyAsinstructor.css";
    import PhoneInput from 'react-phone-number-input';
    import 'react-phone-number-input/style.css';

    const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000";


    // Sample location data (you can expand this with more comprehensive data)
    const locationData = {
        countries: ["USA", "Canada", "UK", "Nigeria", "India", "Australia", "Germany", "France"],
        states: {
        USA: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
        Canada: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"],
        UK: ["England", "Scotland", "Wales", "Northern Ireland"],
        Nigeria: ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"],
        India: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"],
        Australia: ["Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia"],
        Germany: ["Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"],
        France: ["Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", "Centre-Val de Loire", "Corsica", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandy", "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"]
        },
        cities: {
        // USA Cities
        "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Fresno", "Sacramento", "Long Beach", "Oakland", "Bakersfield", "Anaheim"],
        "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon", "Schenectady", "Utica"],
        "Texas": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Laredo"],
        "Florida": ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Tallahassee", "Fort Lauderdale", "Port St. Lucie", "Cape Coral"],
        
        // Canada Cities
        "Ontario": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham", "Vaughan", "Kitchener", "Windsor"],
        "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Levis", "Trois-Rivieres", "Terrebonne", "Saguenay"],
        "British Columbia": ["Vancouver", "Surrey", "Burnaby", "Richmond", "Abbotsford", "Coquitlam", "Kelowna", "Saanich", "White Rock", "Nanaimo"],
        
        // UK Cities
        "England": ["London", "Birmingham", "Manchester", "Liverpool", "Bristol", "Sheffield", "Leeds", "Leicester", "Coventry", "Nottingham"],
        "Scotland": ["Glasgow", "Edinburgh", "Aberdeen", "Dundee", "Inverness", "Perth", "Stirling", "Ayr", "Dunfermline", "Paisley"],
        "Wales": ["Cardiff", "Swansea", "Newport", "Wrexham", "Barry", "Neath", "Cwmbran", "Bridgend", "Llanelli", "Aberdare"],
        
        // Nigeria Cities
        "Lagos": ["Ikeja", "Lekki", "Victoria Island", "Surulere", "Apapa", "Yaba", "Ikorodu", "Badagry", "Epe", "Ibeju-Lekki"],
        "Abuja": ["Garki", "Wuse", "Maitama", "Asokoro", "Gwarinpa", "Jabi", "Utako", "Kubwa", "Lugbe", "Dutse"],
        "Rivers": ["Port Harcourt", "Obio-Akpor", "Okrika", "Eleme", "Oyigbo", "Ikwerre", "Etche", "Omuma", "Ahoada", "Degema"],
        "Kano": ["Kano", "Dawakin Kudu", "Tarauni", "Nassarawa", "Gwale", "Fagge", "Dala", "Kumbotso", "Ungogo", "Kano Municipal"],
        
        // India Cities
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Nanded", "Sangli"],
        "Delhi": ["New Delhi", "Delhi Cantonment", "Narela", "Najafgarh", "Mehrauli", "Saket", "Rohini", "Pitampura", "Dwarka", "Patel Nagar"],
        "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Davanagere", "Bellary", "Vijayapura", "Shimoga", "Tumakuru"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Vellore", "Erode", "Thoothukudi"],
        
        // Australia Cities
        "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Maitland", "Albury", "Wagga Wagga", "Tamworth", "Orange", "Dubbo", "Queanbeyan"],
        "Victoria": ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Melton", "Shepparton", "Wodonga", "Warrnambool", "Mildura", "Sale"],
        "Queensland": ["Brisbane", "Gold Coast", "Sunshine Coast", "Townsville", "Cairns", "Toowoomba", "Mackay", "Rockhampton", "Bundaberg", "Hervey Bay"],
        
        // Germany Cities
        "Bavaria": ["Munich", "Nuremberg", "Augsburg", "Regensburg", "Ingolstadt", "Würzburg", "Fürth", "Erlangen", "Bayreuth", "Bamberg"],
        "Berlin": ["Berlin", "Potsdam", "Cottbus", "Brandenburg an der Havel", "Frankfurt (Oder)"],
        "North Rhine-Westphalia": ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster"],
        
        // France Cities
        "Île-de-France": ["Paris", "Boulogne-Billancourt", "Saint-Denis", "Argenteuil", "Montreuil", "Nanterre", "Créteil", "Versailles", "Courbevoie", "Vitry-sur-Seine"],
        "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice", "Toulon", "Aix-en-Provence", "Avignon", "Antibes", "Cannes", "La Seyne-sur-Mer", "Hyères", "Arles"],
        "Auvergne-Rhône-Alpes": ["Lyon", "Saint-Étienne", "Grenoble", "Villeurbanne", "Clermont-Ferrand", "Vaulx-en-Velin", "Valence", "Vénissieux", "Chambéry", "Annecy"]
        }
    };

    const jobPositions = [
        "Full-Stack Developer Instructor",
        "Frontend Development Instructor",
        "Backend Development Instructor",
        "Mobile App Development Instructor",
        "Data Science Instructor",
        "Machine Learning Engineer Instructor",
        "AI & Deep Learning Instructor",
        "Cybersecurity Instructor",
        "Cloud Computing Instructor (AWS/Azure/GCP)",
        "DevOps Engineer Instructor",
        "Blockchain Developer Instructor",
        "UI/UX Design Instructor",
        "Game Development Instructor",
        "Data Analytics Instructor",
        "Software Testing & QA Instructor",
        "Cloud Architecture Instructor",
        "IT Support & Networking Instructor",
        "Database Administration Instructor",
        "Web3 & Blockchain Instructor",
        "AR/VR Development Instructor",
        "IoT (Internet of Things) Instructor",
        "Other (please specify)"
    ];

    const ApplyAsinstructor = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        location: {
        country: "",
        state: "",
        city: ""
        },
        linkedin: "",
        jobPosition: "",
        preferredStartDate: "",
        resume: "",
    });
    const [errors, setErrors] = useState({
        location: {}
      });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        location: {
            ...prev.location,
            [name]: value,
            // Reset dependent fields when a parent field changes
            ...(name === 'country' && { state: '', city: '' }),
            ...(name === 'state' && { city: '' })
        }
        }));
    };

    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
    } else if (e.type === 'dragleave') {
        setDragActive(false);
    }
    };

    const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type === 'application/pdf' || 
            file.type === 'application/msword' || 
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFileName(file.name);
        setFormData(prev => ({
            ...prev,
            resume: file
        }));
        } else {
        alert('Please upload a valid file type (PDF, DOC, or DOCX)');
        }
    }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
      
        // Check file type
        const fileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!fileTypes.includes(file.type)) {
          setErrors(prev => ({ ...prev, resume: 'Please upload a valid file (PDF, DOC, or DOCX)' }));
          return;
        }
      
        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, resume: 'File size should not exceed 5MB' }));
          return;
        }
      
        setFileName(file.name);
        setFormData(prev => ({
          ...prev,
          resume: file
        }));
        // Clear any previous errors
        setErrors(prev => ({ ...prev, resume: '' }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        // First validate the form
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.jobPosition) newErrors.jobPosition = 'Please select a job position';
        if (!formData.resume) newErrors.resume = 'Resume is required';
        if (!formData.location.country || !formData.location.state || !formData.location.city) {
          newErrors.location = newErrors.location || {};
          if (!formData.location.country) newErrors.location.country = 'Please select a country';
          if (!formData.location.state) newErrors.location.state = 'Please select a state';
          if (!formData.location.city) newErrors.location.city = 'Please select a city';
        }
        if (!formData.preferredStartDate) newErrors.preferredStartDate = 'Please select a preferred start date';
        if (!formData.linkedin) newErrors.linkedin = 'Please provide a LinkedIn URL or portfolio URL';
        if (!formData.message) newErrors.message = 'Please provide a message';
      
        // If there are errors, don't proceed with submission
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          const firstError = Object.keys(newErrors)[0];
          document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      
        // Only set isSubmitting to true if form is valid
        setIsSubmitting(true);
      
        try {
          const formDataToSend = new FormData();
          
          // Append all form fields
          formDataToSend.append('name', formData.name);
          formDataToSend.append('email', formData.email);
          formDataToSend.append('phone', formData.phone);
          formDataToSend.append('message', formData.message);
          formDataToSend.append('linkedin', formData.linkedin);
          formDataToSend.append('jobPosition', formData.jobPosition);
          formDataToSend.append('preferredStartDate', formData.preferredStartDate);
          formDataToSend.append('location', JSON.stringify(formData.location));
          
          if (formData.resume) {
            formDataToSend.append('resume', formData.resume);
          }
      
          const response = await fetch(`${API_BASE}/instructor-applications/create`, {
            method: 'POST',
            body: formDataToSend,
            headers: {
              'Accept': 'application/json',
            },
          });
      
          const data = await response.json();
      
          if (!response.ok) {
            throw new Error(data.message || 'Failed to submit application');
          }
      
          // Handle success
          alert('Application submitted successfully!');
          
          // Reset form
          const fileInput = document.getElementById('resume');
          if (fileInput) {
            fileInput.value = '';  
          }
          
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
            location: { country: "", state: "", city: "" },
            linkedin: "",
            jobPosition: "",
            preferredStartDate: "",
            resume: null,
          });
          setFileName('');
      
        } catch (error) {
          console.error('Error submitting application:', error);
          alert(error.message || 'Failed to submit application. Please try again.');
        } finally {
          // Always set isSubmitting to false when done
          setIsSubmitting(false);
        }
      };

    const selectedCountry = formData.location.country;
    const selectedState = formData.location.state;

    return (
        <div className="applyAsinstructor-page">
        <div className="applyAsinstructor-container">
        <h1>Apply as an instructor to join our platform and start teaching your skills to others.</h1>

        <div className="apply-info">
            <p>Fill in the form below to apply for an instructor position.</p>
            <span>
            Please if you don't have an account create one by{" "}
            <Link to="/auth">Registering</Link> to apply for an instructor position. 
            so that we can process your application easily and quickly.
            </span>
        </div>

        <div className="apply-as-instructor-form">
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            
            <div className="form-group">
                <label>Location</label>
                <div className="location-group">
                <select
                    name="country"
                    value={formData.location.country}
                    onChange={handleLocationChange}
                    className={errors.location?.country ? 'error' : ''}
                >
                    <option value="">Select Country</option>
                    {locationData.countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                    ))}
                </select>

                <select
                    name="state"
                    value={formData.location.state}
                    onChange={handleLocationChange}
                    disabled={!selectedCountry}
                    className={errors.location?.state ? 'error' : ''}
                >
                    <option value="">Select State</option>
                    {selectedCountry && locationData.states[selectedCountry]?.map(state => (
                    <option key={state} value={state}>{state}</option>
                    ))}
                </select>

                <select
                    name="city"
                    value={formData.location.city}
                    onChange={handleLocationChange}
                    disabled={!selectedState}
                    className={errors.location?.city ? 'error' : ''}
                >
                    <option value="">Select City</option>
                    {selectedState && locationData.cities[selectedState]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                {errors.location?.country && <p className="error-message">{errors.location.country}</p>}
                {errors.location?.state && <p className="error-message">{errors.location.state}</p>}
                {errors.location?.city && <p className="error-message">{errors.location.city}</p>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="email">Email we can contact</label>
                <input
                type="email"
                name="email"
                id="email-form"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            
            <div className="form-group">
            <label htmlFor="phone">Phone we can contact</label>
            <PhoneInput
                international
                defaultCountry="US"  // Set default country
                value={formData.phone}
                onChange={(value) => setFormData(prev => ({...prev, phone: value}))}
                placeholder="Enter phone number"
                className={`${errors.phone ? 'error' : ''} phone-input`}
            />
            {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>

            <div className="form-group">
            <label htmlFor="preferredStartDate">Preferred Start Date</label>
            <input
                type="date"
                name="preferredStartDate"
                id="preferredStartDate"
                value={formData.preferredStartDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}  // Prevent selecting past dates
                className={errors.preferredStartDate ? 'error' : ''}    
            />
            {errors.preferredStartDate && <p className="error-message">{errors.preferredStartDate}</p>}
            </div>

            <div className="form-group">
            <label htmlFor="linkedin">LinkedIn / Portfolio URL</label>
            <input
                type="url"
                name="linkedin"
                id="linkedin"
                value={formData.linkedin || ''}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username or your portfolio URL"
                className={`${errors.linkedin ? 'error' : ''} url-input`}
            />
            {errors.linkedin && <p className="error-message">{errors.linkedin}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="jobPosition">Job Position</label>
            <select
                name="jobPosition"
                id="jobPosition"
                value={formData.jobPosition}
                onChange={handleChange}
                className={errors.jobPosition ? 'error' : ''}
            >
                <option value="">Select a position</option>
                {jobPositions.map(position => (
                <option key={position} value={position}>{position}</option>
                ))}
            </select>
            {errors.jobPosition && <p className="error-message">{errors.jobPosition}</p>}
            </div>
            
            <div className="form-group">
                <label htmlFor="message">Why do you want this role?</label>
                <textarea
                name="message"
                id="message"
                cols="30"
                rows="10"
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? 'error' : ''}
                ></textarea>
            {errors.message && <p className="error-message">{errors.message}</p>}
            </div>
            
            <div className="form-group">
                <label>Upload Resume (PDF, DOC, DOCX)</label>
                <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.doc,.docx"
                className={`${errors.resume ? 'error' : ''} file-input`}
                onChange={handleFileChange}
                />
                {errors.resume && <p className="error-message">{errors.resume}</p>}
            </div>
            
            <button 
  type="submit" 
  className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>
      <span className="spinner"></span>
      Submitting...
    </>
  ) : (
    'Submit Application'
  )}
</button>
            </form>
        </div>
        </div>
        </div>
    );
    };

    export default ApplyAsinstructor;