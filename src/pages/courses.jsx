import React, { useState } from "react";
import Nav from './../components/nav';
import Footer from './../components/footer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../assets/styles/courses.css';

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

const courseDataInfo = [
    {
        id: 1,
        courseName: 'Copy Writing',
        courseref: 'School of Digital Marketing/Multimedia',
        duration: '10 Weeks',
        lessonAmount: '10 Lessons',
        location: 'Myteacher Institute Tessy School Junction Rumuagholu off Rumuokoro flyover Port Harcourt',
        description: "Copywriting is the art of crafting persuasive text that prompts a specific action, like clicking, buying, or signing up. It’s essential for marketing, helping brands communicate value and connect with their audience.",
        remotePrice: '30,000,00',
        locally: '90,000,00',
        myTeacherAdmin: 'Bright Owen',
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
        myTeacherAdmin: 'Jane Smith',
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
        myTeacherAdmin: 'John Doe',
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
        myTeacherAdmin: 'Mary Johnson',
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
        myTeacherAdmin: 'Bright Owen',
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
        myTeacherAdmin: 'Jane Smith',
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
        myTeacherAdmin: 'John Doe',
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
        myTeacherAdmin: 'Mary Johnson',
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
        myTeacherAdmin: 'Jane Smith',
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
        myTeacherAdmin: 'Bright Owen',
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
        myTeacherAdmin: 'John Doe',
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
        myTeacherAdmin: 'Mary Johnson',
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
        myTeacherAdmin: 'Jane Smith',
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
        myTeacherAdmin: 'Bright Owen',
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
        myTeacherAdmin: 'John Doe',
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
        myTeacherAdmin: 'Mary Johnson',
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
        myTeacherAdmin: 'Jane Smith',
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
        myTeacherAdmin: 'Bright Owen',
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
        myTeacherAdmin: 'Mary Johnson',
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
        myTeacherAdmin: 'Jane Smith',
        courseImage: digitalMarketingImage,
    }
];

const Courses = () => {
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
          </div>
        <div className="crs-wrapper-container">
          {filteredCourses.length === 0 && (
            <p style={{ padding: "2rem", textAlign: "center" }}>No courses found.</p>
          )}
          {filteredCourses.map((data) => (
            <div className="crs-wrapper-box" key={data.id}>
              <img src={data.courseImage} alt={data.courseName} />
              <div className="crs-des">
                <h2>{data.courseName}</h2>
                <span>By {data.myTeacherAdmin} in {data.courseref}</span>
                <div className="timeDur">
                  <span>{data.duration}</span>
                  <span>{data.lessonAmount}</span>
                </div>
                <p className="des">✅ {data.description}</p>
                <div className="money-section">
                  <div>
                    <span>Remote</span>
                    <p>{data.remotePrice}</p>
                    <button>Enroll</button>
                  </div>
                  <div>
                    <span>At the Location</span>
                    <p>{data.locally}</p>
                    <button>Enroll</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Courses;