
// new images

import uiUxImage from '../assets/crimage/myteacher-uiux.jpg';
import fullStackImage from '../assets/crimage/fullstack-at-myteacher-intitute.png';
import cyberSecurityImage from '../assets/crimage/cyber-security-at-myteacher-intitute.png';
import dataAnalysicImage from '../assets/crimage/data-analytics-at-myteacher-intitute.jpg';
import mobileAppImage from '../assets/crimage/myteacher-intitute-mobile-app.png';
import { Link } from "react-router-dom";

const PopularCourses = () => {
    return (
        <section id="popular-courses" className="fade-in">
            <div className="containers">
                <div className="section-header2">
                    <h2>Our Courses</h2>
                    <p className="section-subtitle">Specializations and Professional Certificates</p>
                    <p>Explore our most popular programs, get job ready for an in-demand career</p>
                </div>
                <div className="course-grid">
                    <div className="course-item">
                        <div className="course-items-image">
                            <a href="#">
                                <img src={fullStackImage} alt="Web Development" />
                                <span>AI skills included</span>
                            </a>
                        </div>
                        <div className="course-items-content">
                            <a href="#">Web Development</a>
                            <p>Master front-end and back-end development to create dynamic web applications.</p>
                        </div>
                        <div className="course-meta">
                            <a href="#" className="degree-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                </svg>
                                Professional Certificate
                            </a>
                        </div>
                    </div>
                    <div className="course-item">
                        <div className="course-items-image">
                            <a href="#">
                                <img src={dataAnalysicImage} alt="Data Analysis" />
                                <span>AI skills included</span>
                            </a>
                        </div>
                        <div className="course-items-content">
                            <a href="#">Data Analysis</a>
                            <p>Analyze data to uncover insights and drive informed decision-making.</p>
                        </div>
                        <div className="course-meta">
                            <a href="#" className="degree-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                </svg>
                                Professional Certificate
                            </a>
                        </div>
                    </div>
                    <div className="course-item">
                        <div className="course-items-image">
                            <a href="#">
                                <img src={cyberSecurityImage} alt="Cyber Security" />
                                <span>AI skills included</span>
                            </a>
                        </div>
                        <div className="course-items-content">
                            <a href="#">Cyber Security</a>
                            <p>Protect networks and systems from cyber threats with industry best practices.</p>
                        </div>
                        <div className="course-meta">
                            <a href="#" className="degree-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                </svg>
                                Professional Certificate
                            </a>
                        </div>
                    </div>
                    <div className="course-item">
                        <div className="course-items-image">
                            <a href="#">
                                <img src={uiUxImage} alt="UX/UI Design" />
                                <span>AI skills included</span>
                            </a>
                        </div>
                        <div className="course-items-content">
                            <a href="#">UX/UI Design</a>
                            <p>Design intuitive and engaging user experiences and interfaces.</p>
                        </div>
                        <div className="course-meta">
                            <a href="#" className="degree-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                </svg>
                                Professional Certificate
                            </a>
                        </div>
                    </div>
                    <div className="course-item">
                        <div className="course-items-image">
                            <a href="#">
                                <img src={mobileAppImage} alt="App Development" />
                                <span>AI skills included</span>
                            </a>
                        </div>
                        <div className="course-items-content">
                            <a href="#">App Development</a>
                            <p>Develop cross-platform mobile apps for iOS and Android.</p>
                        </div>
                        <div className="course-meta">
                            <a href="#" className="degree-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                </svg>
                                Professional Certificate
                            </a>
                        </div>
                    </div>
                </div>
                <div className="popular-courses-more-btn-container">
                    <Link to="/auth" className="btn btn--primary">
                        Start Now
                    </Link>
                    <Link to="/courses" className="btn btn--outline">
                        View all
                        <svg aria-hidden="true" fill="none" focusable="false" height="24" viewBox="0 0 20 20" width="24">
                            <path
                                d="M13.125 10.75H4.75a.728.728 0 01-.535-.214.72.72 0 01-.215-.532c0-.21.072-.39.215-.535a.72.72 0 01.535-.219h8.375L9.454 5.579a.721.721 0 01-.225-.527c0-.201.077-.382.23-.541a.745.745 0 011.058.006l4.954 4.96a.722.722 0 01.216.526.76.76 0 01-.052.282.692.692 0 01-.156.236l-4.958 4.958a.681.681 0 01-.521.219.776.776 0 01-.52-.23.766.766 0 01-.23-.544.71.71 0 01.23-.528l3.645-3.646z"
                                fill="#008ed6">
                            </path>
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default PopularCourses;