import React, { useState } from "react";
import Nav from './../components/nav';
import Footer from './../components/footer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../assets/styles/courses.css';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/styles.css'

// image place
import copyWritingImage from '../assets/crimage/learn-copy-writing-in-Port-Harcourt-at-myteacher-intitute.png';
import basicComputingImage from '../assets/crimage/learn-basic-computing-in-port-harcourt-myteacher-intitute.png';
import visualAssitantImage from '../assets/crimage/virtual-assistant-course-at-myteacher-intitute-Port-Harcourt-Myteacher-Institute.jpg';
import dataEntryImage from '../assets/crimage/myteacher-institute-data-entry.jpg';
import contentCreationImage from '../assets/crimage/my-teacher-institute-social-media-marketing-learn-content-creation-and-social-media-marketing-in-Port-Harcourt-at-myteacher-intitute.png';
import powerBiImage from '../assets/crimage/power-BI-myteacher-insitute.png';
import backEndImage from '../assets/crimage/backend-programming-myteacher-institute.png';
import frontEndImage from '../assets/crimage/Front-End-Development-myteacher-institute.jpg';
import mobileAppImage from '../assets/crimage/myteacher-intitute-mobile-app.png';
import generativeAiIMAGE from '../assets/crimage/Generative-AI-at-myteacher-intitute.png';
import projectManagementImage from '../assets/crimage/at-myteacher-intitute-project-management.jpg';
import graphicsImage from '../assets/crimage/graphics-at-myteacher-intitute.png';
import uiUxImage from '../assets/crimage/myteacher-uiux.jpg';
import fullStackImage from '../assets/crimage/fullstack-at-myteacher-intitute.png';
import cyberSecurityImage from '../assets/crimage/cyber-security-at-myteacher-intitute.png';
import dataAnalysicImage from '../assets/crimage/data-analytics-at-myteacher-intitute.jpg';
import sqlDataBaseImage from '../assets/crimage/sql-couser-at-myteacher-intitute.png';
import pyDataImage from '../assets/crimage/python-for-data-analysis-course-at-myteacher-intitute.png';
import excelDataImage from '../assets/crimage/Data-Analysis-Using-Excel-at-myteacher-intitute.jpg';
import digitalMarketingImage from '../assets/crimage/learn-digital-marjeting-in-port-harcourt-at-myteacher-intitute.jpg';
import { Link } from "react-router-dom";
import FooterFd from "../components/fd/Footer";

const courseDataInfo = [
    {
        id: 1,
        courseName: 'Copy Writing',
        courseref: 'School of Digital Marketing/Multimedia',
        duration: '10 Weeks',
        lessonAmount: '10 Lessons',
        location: 'Myteacher Institute Tessy School Junction Rumuagholu off Rumuokoro flyover Port Harcourt',
        description: "Copywriting is crafting persuasive text that drives actions like clicking or buying, essential for marketing success.",
        remotePrice: '30,000,00',
        locally: '90,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        link: "/copy-right",
        courseImage: copyWritingImage,
    },
    {
        id: 2,
        courseName: 'Basic Computing',
        courseref: 'School of Computing',
        duration: '8 Weeks',
        lessonAmount: '8 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Learn the basics of computers, internet, and productivity tools for everyday use.",
        remotePrice: '25,000,00',
        locally: '70,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        link: "/basic-computing",
        courseImage: basicComputingImage,
    },
    {
        id: 3,
        courseName: 'Virtual Assistant',
        courseref: 'School of Digital Skills',
        duration: '6 Weeks',
        lessonAmount: '6 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Become a professional virtual assistant and work for clients worldwide.",
        remotePrice: '20,000,00',
        locally: '60,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        link: "/virtual-assistant",
        courseImage: visualAssitantImage,
    },
    {
        id: 4,
        courseName: 'Data Entry',
        courseref: 'School of Digital Skills',
        duration: '5 Weeks',
        lessonAmount: '5 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Master data entry skills for office and remote jobs.",
        remotePrice: '15,000,00',
        locally: '50,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        link: "/data-entry",
        courseImage: dataEntryImage,
    },
    {
        id: 5,
        courseName: 'Content Creation & Social Media Marketing',
        courseref: 'School of Digital Marketing/Multimedia',
        duration: '12 Weeks',
        lessonAmount: '12 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Learn to create engaging content and market on social media platforms.",
        remotePrice: '35,000,00',
        locally: '100,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        link: "/content-creation",
        courseImage: contentCreationImage,
    },
    {
        id: 6,
        courseName: 'Power BI',
        courseref: 'School of Data',
        duration: '8 Weeks',
        lessonAmount: '8 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Analyze and visualize data using Microsoft Power BI.",
        remotePrice: '40,000,00',
        locally: '110,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        link: "/power-bi",
        courseImage: powerBiImage,
    },
    {
        id: 7,
        courseName: 'Backend Programming',
        courseref: 'School of Programming',
        duration: '14 Weeks',
        lessonAmount: '14 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Learn backend development with Node.js, Python, and databases.",
        remotePrice: '50,000,00',
        locally: '150,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        link: "/backend-programming",
        courseImage: backEndImage,
    },
    {
        id: 8,
        courseName: 'Front-End Development',
        courseref: 'School of Programming',
        duration: '14 Weeks',
        lessonAmount: '14 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Master HTML, CSS, JavaScript, and React for front-end web development.",
        remotePrice: '50,000,00',
        locally: '150,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        courseImage: frontEndImage,
    },
    {
        id: 9,
        courseName: 'Mobile App Development',
        courseref: 'School of Programming',
        duration: '16 Weeks',
        lessonAmount: '16 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Build mobile apps for Android and iOS using Flutter and React Native.",
        remotePrice: '60,000,00',
        locally: '180,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        courseImage: mobileAppImage,
    },
    {
        id: 10,
        courseName: 'Generative AI',
        courseref: 'School of AI',
        duration: '10 Weeks',
        lessonAmount: '10 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Explore generative AI models and their applications.",
        remotePrice: '70,000,00',
        locally: '200,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        courseImage: generativeAiIMAGE,
    },
    {
        id: 11,
        courseName: 'Project Management',
        courseref: 'School of Business',
        duration: '12 Weeks',
        lessonAmount: '12 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Learn project management methodologies and tools.",
        remotePrice: '45,000,00',
        locally: '120,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        courseImage: projectManagementImage,
    },
    {
        id: 12,
        courseName: 'Graphics Design',
        courseref: 'School of Digital Marketing/Multimedia',
        duration: '10 Weeks',
        lessonAmount: '10 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Master Adobe Photoshop, Illustrator, and design principles.",
        remotePrice: '30,000,00',
        locally: '90,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        courseImage: graphicsImage,
    },
    {
        id: 13,
        courseName: 'UI/UX Design',
        courseref: 'School of Digital Marketing/Multimedia',
        duration: '10 Weeks',
        lessonAmount: '10 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Learn user interface and user experience design for web and mobile.",
        remotePrice: '35,000,00',
        locally: '100,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        courseImage: uiUxImage,
    },
    {
        id: 14,
        courseName: 'Full Stack Development',
        courseref: 'School of Programming',
        duration: '20 Weeks',
        lessonAmount: '20 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Become a full stack developer with front-end and back-end skills.",
        remotePrice: '80,000,00',
        locally: '250,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        courseImage: fullStackImage,
    },
    {
        id: 15,
        courseName: 'Cyber Security',
        courseref: 'School of IT',
        duration: '12 Weeks',
        lessonAmount: '12 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Learn to protect systems and networks from cyber threats.",
        remotePrice: '60,000,00',
        locally: '180,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        courseImage: cyberSecurityImage,
    },
    {
        id: 16,
        courseName: 'Data Analytics',
        courseref: 'School of Data',
        duration: '10 Weeks',
        lessonAmount: '10 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Analyze data and gain insights using modern tools.",
        remotePrice: '50,000,00',
        locally: '150,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        courseImage: dataAnalysicImage,
    },
    {
        id: 17,
        courseName: 'SQL Database',
        courseref: 'School of Data',
        duration: '8 Weeks',
        lessonAmount: '8 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Learn SQL for managing and querying databases.",
        remotePrice: '30,000,00',
        locally: '90,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        courseImage: sqlDataBaseImage,
    },
    {
        id: 18,
        courseName: 'Python for Data Analysis',
        courseref: 'School of Data',
        duration: '10 Weeks',
        lessonAmount: '10 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Use Python for data analysis and visualization.",
        remotePrice: '55,000,00',
        locally: '160,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        courseImage: pyDataImage,
    },
    {
        id: 19,
        courseName: 'Excel for Data Analysis',
        courseref: 'School of Data',
        duration: '8 Weeks',
        lessonAmount: '8 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Analyze data using Microsoft Excel.",
        remotePrice: '25,000,00',
        locally: '70,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        courseImage: excelDataImage,
    },
    {
        id: 20,
        courseName: 'Digital Marketing',
        courseref: 'School of Digital Marketing/Multimedia',
        duration: '12 Weeks',
        lessonAmount: '12 Lessons',
        location: 'Myteacher Institute, Port Harcourt',
        description: "Master digital marketing strategies and tools.",
        remotePrice: '40,000,00',
        locally: '120,000,00',
        myTeacherAdmin: 'MyteacherAdmin',
        courseImage: digitalMarketingImage,
    }
];

const Courses = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Filter courses by courseName, courseref, admin, price, or description
  const filteredCourses = courseDataInfo.filter((data) => {
    const searchLower = search.toLowerCase();
    return (
      data.courseName.toLowerCase().includes(searchLower) ||
      data.courseref.toLowerCase().includes(searchLower) ||
      data.myTeacherAdmin.toLowerCase().includes(searchLower) ||
      data.remotePrice.toLowerCase().includes(searchLower) ||
      data.locally.toLowerCase().includes(searchLower) ||
      data.description.toLowerCase().includes(searchLower)
    );
  });

  const handleEnrollClick = () => {
    navigate('/auth');
  }

  const [isGridView, setIsGridView] = useState(true);


  return (
    <div className="cr-container">
      <Nav />
      <div className="courses-content-section">
        <div className="courses-section-header">
          <h2>Myteacher Courses</h2>
          <p>Courses We offer both on-site and Location</p>
        </div>

          <div className="search-div">
            <input
              type="search"
              placeholder="search for course"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <i className="fas fa-search"></i>

            <div className="crs-gride-toggle">
              <i 
                className={`fas fa-th ${isGridView ? 'active' : ''}`}
                onClick={() => setIsGridView(true)}
                style={{ cursor: 'pointer' }}
              ></i>

              <i 
                className={`fas fa-list ${!isGridView ? 'active' : ''}`}
                onClick={() => setIsGridView(false)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>

          </div>
        <div className={`crs-wrapper-container ${isGridView ? "grid-view" : "list-view"}`}>
          {filteredCourses.length === 0 && (
            <p style={{ padding: "2rem", textAlign: "center" }}>No courses found.</p>
          )}
          {filteredCourses.map((data) => (
            <div className="crs-wrapper-box" key={data.id}>
              <img src={data.courseImage} alt={data.courseName} />
              <div className="crs-des">
                <Link to={data.link} className="h1-texte">{data.courseName}</Link>
                <span>By {data.myTeacherAdmin} in {data.courseref}</span>
                <div className="timeDur">
                  <span>{data.duration}</span>
                  <span>{data.lessonAmount}</span>
                </div>
                <p className="des">✅ {data.description}</p>
                <Link to={data.link} className="readmore-btn">Read more <i className="fas fa-arrow-right-long"></i></Link>

                <div className="money-section">
                  <div>
                    <span>Remote</span>
                    <p>{data.remotePrice}</p>
                    <button onClick={handleEnrollClick}>Enroll</button>
                  </div>
                  <div>
                    <span>Locally</span>
                    <p>{data.locally}</p>
                    <button onClick={handleEnrollClick}>Enroll</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FooterFd />
    </div>
  );
};

export default Courses;