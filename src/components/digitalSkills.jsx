import { useEffect } from "react";
import OfflineImg from '../assets/images/offlineClassImg.webp';
import OnlineImg from '../assets/images/onlineClassImg.webp';
import PrivateClassesImg from '../assets/images/privateClassesImg.webp';


const DigitalSkills = () => {
    return (
        <section id="digital-skills">
            <div className="containers">
                <div className="section-header1">
                    <h2>Learn Digital Skills That Pay</h2>
                    <p>
                        Unlock high-demand career opportunities and boost your earning potential. Learn from dedicated and
                        experienced professionals. Get certified as a <strong>Tech Expert.</strong>
                    </p>
                </div>
                <div className="course-cards">
                    <div className="course-card">
                        <div className="course-items-image">
                            <a href="#">
                                <img src={OfflineImg} alt="Offline Classes" />
                            </a>
                        </div>
                        <h3>Offline Classes (Physical Classes)</h3>
                        <p>
                            Join our in-person digital skills training in Port Harcourt, designed for individuals,
                            businesses, and teams to grow their brands and increase profits through expert-led
                            physical classes.
                        </p>
                        <button className="card-button">Learn More</button>
                    </div>
                    <div className="course-card">
                        <div className="course-items-image">
                            <a href="#">
                                <img src={OnlineImg} alt="Online School" />
                            </a>
                        </div>
                        <h3>Online School</h3>
                        <p>
                            Access our flexible online courses. Learn at your own pace, gain in-demand tech
                            skills, and earn certifications to boost your career—all from the comfort of your home.
                        </p>
                        <button className="card-button">Learn More</button>
                    </div>
                    <div className="course-card">
                        <div className="course-items-image">
                            <a href="#">
                                <img src={PrivateClassesImg} alt="Private Classes" />
                            </a>
                        </div>
                        <h3>Private Classes</h3>
                        <p>
                            Enjoy personalized one-on-one coaching and tailored corporate training sessions, available both
                            in-person and online, to meet your specific learning and business needs.
                        </p>
                        <button className="card-button">Learn More</button>
                    </div>
                </div>
                <button className="courses-explore">Explore all roles</button>
            </div>
        </section>
    );
}

export default DigitalSkills;