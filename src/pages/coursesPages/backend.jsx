import React from 'react';
import Nav from "../../components/nav";
import { Link } from 'react-router-dom';
import '../../assets/styles/cr/copyright.css';

import backEndImage from '../../assets/crimage/backend-programming-myteacher-institute.png';

const Backend = () => {
    return (
        <div className="copy-wrapper">
            <Nav />
            <div className="copy-container">
                <div className="copy-header">
                    <h1>Backend Programming</h1>
                    <p>Myteacher Institute Tessy School Junction, Rumuagholu, off Rumuokoro Flyover, Port Harcourt</p>
                </div>

                <div className="copy-image">
                    <img src={backEndImage} alt="Backend Programming class" />
                </div>

                <div className="copy-side">
                    <div className="box"><span><i className="fas fa-money-bill-wave"></i> Locally</span><span>₦150,000</span></div>
                    <div className="box"><span><i className="fas fa-money-bill-wave"></i> Remote</span><span>₦70,000</span></div>
                    <div className="box"><span><i className="fas fa-bookmark"></i> Remote</span><span>Learn Online</span></div>
                    <div className="box"><span><i className="fas fa-bookmark"></i> Locally</span><span>Learn on Site</span></div>
                    <div className="box"><span><i className="fas fa-clock"></i> Duration</span><span>6 Weeks</span></div>
                    <div className="box"><span><i className="fas fa-copy"></i> Lessons</span><span>18 Lessons</span></div>
                    <button className="btn local">📱 Contact to Enroll</button>
                    <button className="btn remote">💳 Enroll Now (₦70,000)</button>
                </div>

                <div className="copy-description">
                    <h2>✅ Who is a Backend Developer?</h2>

                    <div className="section">
                        <p style={{ fontSize: '1.6rem', lineHeight: '1.6', marginBottom: '20px' }}>
                            A back-end developer is a type of programmer who specializes in creating and maintaining the server-side logic, databases, and other components of a web application or software. While front-end developers focus on what users interact with directly, such as the visual elements and user interface, back-end developers work behind the scenes to ensure that the application runs smoothly and efficiently.
                        </p>
                        <p style={{ fontSize: '1.6rem', lineHeight: '1.6', marginBottom: '20px' }}>
                            Back-end developers typically work with programming languages such as Python, Java, Ruby, PHP, or Node.js, as well as frameworks and tools like Django, Spring Boot, Ruby on Rails, Laravel, and Express.js. They often collaborate closely with front-end developers, designers, and other members of the development team to ensure that the entire application functions seamlessly and meets the needs of users.
                        </p>
                    </div>

                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '40px 0 20px' }}>
                        ✅ Benefits of learning Backend development
                    </h2>

                    <ul style={{ fontSize: '1.6rem', marginBottom: '30px' }}>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}><strong>High Demand:</strong> Backend developers are in high demand due to the growing need for web and mobile applications.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}><strong>Strong Career Prospects:</strong> Mastering backend skills opens opportunities in various industries, from startups to large corporations.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}><strong>Problem-Solving Skills:</strong> Backend development involves logic, algorithms, and database management, which enhance problem-solving capabilities.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}><strong>Higher Earning Potential:</strong> Backend developers often earn higher salaries compared to some other tech roles.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}><strong>Flexibility:</strong> Knowledge of backend technologies can be applied to web apps, mobile apps, APIs, and even IoT devices.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}><strong>Collaboration:</strong> Backend developers often work closely with frontend developers, product teams, and designers, enhancing teamwork skills.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}><strong>Understanding the Full Stack:</strong> Learning backend complements frontend skills, enabling you to become a full-stack developer.</li>
                    </ul>

                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '40px 0 20px' }}>
                        What you will learn:
                    </h2>
                    
                    <p style={{ fontSize: '1.6rem', lineHeight: '1.6', marginBottom: '20px' }}>
                        In this programme, you can choose to learn any of the backend stack below:
                    </p>

                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: '30px 0 15px', color: '#2c3e50' }}>✅ 1. Node.js (JavaScript)</h3>
                        <p style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '10px' }}>Key Technologies:</p>
                        <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
                            <li style={{ marginBottom: '8px' }}><strong>Frameworks:</strong> Express.js, NestJS</li>
                            <li style={{ marginBottom: '8px' }}><strong>Databases:</strong> MongoDB, PostgreSQL, MySQL</li>
                            <li style={{ marginBottom: '8px' }}><strong>Tools:</strong> Mongoose (ODM for MongoDB)</li>
                            <li style={{ marginBottom: '8px' }}><strong>API Development:</strong> RESTful APIs, GraphQL</li>
                            <li><strong>Authentication:</strong> Passport.js, JSON Web Tokens (JWT)</li>
                        </ul>
                        <p style={{ fontSize: '1.6rem', fontStyle: 'italic' }}>Duration: 2-3 months (JavaScript, Express.js, REST APIs)</p>
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: '30px 0 15px', color: '#2c3e50' }}>✅ 2. PHP</h3>
                        <p style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '10px' }}>Key Technologies:</p>
                        <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
                            <li style={{ marginBottom: '8px' }}><strong>Frameworks:</strong> Laravel</li>
                            <li style={{ marginBottom: '8px' }}><strong>Databases:</strong> MySQL</li>
                            <li style={{ marginBottom: '8px' }}><strong>Tools:</strong> Eloquent ORM (Laravel)</li>
                            <li style={{ marginBottom: '8px' }}><strong>API Development:</strong> RESTful APIs, GraphQL (Laravel Lighthouse)</li>
                            <li><strong>Authentication:</strong> Laravel Sanctum, OAuth</li>
                        </ul>
                        <p style={{ fontSize: '1.6rem', fontStyle: 'italic' }}>Duration: 2-3 months (PHP syntax, Laravel, CRUD apps)</p>
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: '30px 0 15px', color: '#2c3e50' }}>✅ 3. Python</h3>
                        <p style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '10px' }}>Key Technologies:</p>
                        <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
                            <li style={{ marginBottom: '8px' }}><strong>Frameworks:</strong> Django</li>
                            <li style={{ marginBottom: '8px' }}><strong>Databases:</strong> MySQL</li>
                            <li style={{ marginBottom: '8px' }}><strong>API Development:</strong> RESTful APIs (Django REST Framework), FastAPI for modern APIs</li>
                            <li><strong>Authentication:</strong> Django Authentication, OAuth, JWT</li>
                        </ul>
                        <p style={{ fontSize: '1.6rem', fontStyle: 'italic' }}>Duration: 2-3 months (Python basics, Flask/Django, CRUD operations)</p>
                    </div>

                    <div className="section highlight" style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
                        <p style={{ fontSize: '1.6rem', lineHeight: '1.6', marginBottom: '15px' }}>
                            Learn Backend Web Development in Port Harcourt, Lagos, Abuja, and worldwide - online or on-site. Master server-side programming with Node.js, PHP, or Python and build powerful web applications.
                        </p>
                        <p style={{ fontSize: '1.6rem', lineHeight: '1.6', marginBottom: '15px' }}>
                            Contact <Link to="/" style={{ color: '#2980b9', textDecoration: 'none', fontWeight: 600 }}>Myteacher Institute</Link> today to start your journey as a backend developer!
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '5px' }}>Duration</p>
                                <p style={{ fontSize: '1.6rem' }}>2-3 months per stack</p>
                            </div>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '5px' }}>Fees (Local)</p>
                                <p style={{ fontSize: '1.6rem' }}>₦60,000</p>
                            </div>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '5px' }}>Fees (Remote)</p>
                                <p style={{ fontSize: '1.6rem' }}>₦20,000</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Backend;
