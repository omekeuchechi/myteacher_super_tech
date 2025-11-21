import { useEffect } from "react";

// image imports
import fullstack from "../../img/fdimage/fullstackwebdev.png";
import dataAnalytics from "../../img/fdimage/datascience_and_analytics.png";
import digitalMarketing from "../../img/fdimage/digitalmarketingmastering.png";
import uiux from "../../img/fdimage/uiux.png";
import cyberSecurity from "../../img/fdimage/cybersecurity.png";
import mobileApp from "../../img/fdimage/mobileappdev.png";

import star from "../../img/fdimage/star.svg";
import clock from "../../img/fdimage/clock.svg";
import { Link } from "react-router-dom";

const programData = [
    {
        id: 1,
        title: "Full Stack Web Development",
        description: "Master HTML, CSS, JavaScript, React, Node.js and build real-world projects",
        category: "Web Development",
        rating: 4.8,
        image: fullstack,
        price: '$299',
        duration: '12 Weeks',
        tagColor: "#2563EB",
        tagBgColor: "#DBEAFE",
    },
    {
        id: 2,
        title: "Data Science & Analytics",
        description: "Learn Python, SQL, data visualization and machine learning fundamentals",
        category: "Data Analytics",
        rating: 4.9,
        image: dataAnalytics,
        price: '$349',
        duration: '12 Weeks',
        tagColor: "#15803D",
        tagBgColor: "#DCFCE7",
    },
    {
        id: 3,
        title: "Digital Marketing Mastery",
        description: "Master SEO, social media marketing, content strategy and paid advertising",
        category: "Digital Marketing",
        rating: 4.9,
        image: digitalMarketing,
        price: '$249',
        duration: '12 Weeks',
        tagColor: "#7E22CE",
        tagBgColor: "#F3E8FF",
    },
    {
        id: 4,
        title: "UI/UX Design Fundamentals",
        description: "Create stunning user interfaces and experiences using Figma and Adobe XD",
        category: "Design",
        rating: 4.8,
        image: uiux,
        price: '$279',
        duration: '12 Weeks',
        tagColor: "#BE185D",
        tagBgColor: "#FCE7F3",
    },
    {
        id: 5,
        title: "Cybersecurity Fundamentals",
        description: "Protect systems and networks with ethical hacking and security protocols",
        category: "Security",
        rating: 4.8,
        image: cyberSecurity,
        price: '$399',
        duration: '12 Weeks',
        tagColor: "#B91C1C",
        tagBgColor: "#FEE2E2"
    },
    {
        id: 6,
        title: "Mobile App Development",
        description: "Build iOS and Android apps using React Native and Flutter frameworks",
        category: "Mobile Dev",
        rating: 4.7,
        image: mobileApp,
        price: '$429',
        duration: '12 Weeks',
        tagColor: "#4338CA",
        tagBgColor: "#E0E7FF",
    },
]

const Programs = () => {
    return (
        <section className="programs-section">
            <h2>Digital Skills Programmes</h2>
            <p>Choose a Digital skill and start learning</p>

            <div className="program-wraper">
                {programData.map((program) => (
                    <div className="program-card" key={program.id}>
                        <div className="img-wrapper">
                            <img src={program.image} alt={program.title} />
                        </div>

                        <div className="c-section">
                            <span className="c-tag" style={{color: program.tagColor, backgroundColor: program.tagBgColor}}>{program.category}</span>
                            <span className="rating"><img src={star} className="star" alt="" /> {program.rating}</span>
                        </div>

                        <div className="program-content">
                            <h2>{program.title}</h2>
                            <p>{program.description}</p>
                        </div>

                        <div className="program-tl">
                            <span className="duration">
                                <img src={clock} alt="" />{program.duration}</span>
                                <Link to="/auth">Learn More</Link>
                        </div>

                        <div className="program-actions">
                            <Link to="/apply" className="take-online-coursees"><p>Take Online Course</p> <span>{program.price}</span></Link>
                            <Link to="/auth" className="book-online-course">Book Live Online Classes</Link>
                            <a href="https://myteacher.ng/training-registration-form/" className="onsite-training">Register Onsite</a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Programs;