import { useState } from 'react';
import firstImage from '../img/myteacher_institute_learning.jpeg';
import "../assets/styles/mainTwo.css";

const MainTwo = () => {
    const [showPara, setShowPara] = useState(false);
    return (
        <div className="main-two">
            <img src={firstImage} alt="myteacher.institute learning platform" />
            <div className="main-two-content">
            <h1>Myteacher Institute</h1>
            <p>Discover Myteacher Institute - Your Premier Online Learning Platform for Comprehensive Education. Explore 100+ Expert-Led Courses, Interactive Resources & Flexible Learning Solutions. Join Thousands of Students Worldwide in Our User-Friendly Digital Classroom. Start Your Learning Journey Today with Top-Rated Online Education...</p>
            <p className={`main-two-content-p ${!showPara ? 'hide-p' : 'show-p'}`}>Myteacher Institute is a leading online education platform that offers a wide range of courses and resources to help students learn and grow. Our platform is designed to be user-friendly and easy to navigate, making it easy for students to find the information they need.</p>
            <button className="main-two-content-btn" onClick={() => setShowPara(!showPara)}>{!showPara ? 'Read More' : 'Read less'}</button>
            </div>
        </div>
    );
};

export default MainTwo;
