import React from 'react';
import Nav from "../../components/nav";
import { Link } from 'react-router-dom';
import '../../assets/styles/cr/copyright.css';

import contentCreationImage from '../../assets/crimage/my-teacher-institute-social-media-marketing-learn-content-creation-and-social-media-marketing-in-Port-Harcourt-at-myteacher-intitute.png';

const ContentCreation = () => {
    return (
        <div className="copy-wrapper">
            <Nav />
            <div className="copy-container">
                <div className="copy-header">
                    <h1>Content Creation and Social Media Management</h1>
                    <p>Myteacher Institute Tessy School Junction, Rumuagholu, off Rumuokoro Flyover, Port Harcourt</p>
                </div>

                <div className="copy-image">
                    <img src={contentCreationImage} alt="Content Creation and Social Media Management class" />
                </div>

                <div className="copy-side">
                    <div className="box"><span><i className="fas fa-money-bill-wave"></i> Locally</span><span>₦50,000</span></div>
                    <div className="box"><span><i className="fas fa-money-bill-wave"></i> Remote</span><span>₦15,000</span></div>
                    <div className="box"><span><i className="fas fa-bookmark"></i> Remote</span><span>Learn Online</span></div>
                    <div className="box"><span><i className="fas fa-bookmark"></i> Locally</span><span>Learn on Site</span></div>
                    <div className="box"><span><i className="fas fa-clock"></i> Duration</span><span>6 Weeks</span></div>
                    <div className="box"><span><i className="fas fa-copy"></i>Lessons</span><span>12</span></div>
                    <button className="btn local">📱 Contact to Enroll</button>
                    <button className="btn remote">💳 Enroll Now</button>
                </div>

                <div className="copy-description">
                    <h2>✅ Content Creation and Social Media Management</h2>

                    <div className="section">
                        <h3>What is Content Creation?</h3>
                        <p>
                            Creating valuable and relevant materials like text, images, videos, or infographics to draw in and keep an audience is called content creation. The practice has evolved and now takes center stage in any communication. This simply means that the process can be used for storytelling, branding or even digital marketing.
                        </p>
                    </div>

                    <div className="section">
                        <h3>What is Social Media Management?</h3>
                        <p>
                            It is the process of planning, creating, posting and analyzing content posted on social media. It is about strengthening connections, engaging with the target audience, and achieving objectives through content that speaks to the audience.
                        </p>
                    </div>

                    <div className="section highlight">
                        <p>
                            Learn Content Creation and Social Media Management in Port Harcourt, Lagos, Abuja, and worldwide, online and onsite. Contact <Link to="/customer-support">Myteacher Institute</Link> today.
                        </p>
                    </div>

                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>
                        Why You Should Learn This Skill
                    </h2>

                    <p style={{ fontSize: '1.6rem', marginBottom: '20px' }}>
                        Content creation and social media management are two skills that you can't avoid in a world where digitization is prioritized. Here's why:
                    </p>

                    <ul style={{ fontSize: '1.6rem', marginBottom: '30px' }}>
                        <li style={{ fontWeight: 900, marginBottom: '10px' }}>High Demand: Several companies and brands are seeking professionals that can represent them online.</li>
                        <li style={{ fontWeight: 900, marginBottom: '10px' }}>Flexible Career: You can work from home, as a freelancer, or set up your own business.</li>
                        <li style={{ fontWeight: 900, marginBottom: '10px' }}>Enhance Personal Branding: Set yourself apart from the overcrowded digital space.</li>
                        <li style={{ fontWeight: 900 }}>Drive Results: Create content that is informative, captivating, and helps drive conversions.</li>
                    </ul>

                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '40px' }}>
                        What You Will Learn
                    </h2>

                    <p style={{ fontSize: '1.8rem', marginBottom: '20px' }}>
                        At the end of this program, you will have:
                    </p>

                    <ul style={{ fontSize: '1.6rem', marginBottom: '30px' }}>
                        <li style={{ fontWeight: 900, marginBottom: '10px' }}>Content Creation Techniques: Strategies for producing imaginative texts, graphics, and multimedia content.</li>
                        <li style={{ fontWeight: 900, marginBottom: '10px' }}>Video editing tips and skits creation.</li>
                        <li style={{ fontWeight: 900, marginBottom: '10px' }}>Social Media Strategies: Learning how to encourage and expand audiences on different platforms.</li>
                        <li style={{ fontWeight: 900, marginBottom: '10px' }}>Platform Optimization: Facebook, Instagram, TikTok, and LinkedIn.</li>
                        <li style={{ fontWeight: 900 }}>Monetization strategies and Portfolio creation/optimization.</li>
                    </ul>

                    <h3 style={{ fontSize: '1.8rem', margin: '40px 0 20px' }}>✅ Course Outline</h3>
                    <ol className="benefits">
                        {[
                            { 
                                title: "Module 1: Introduction to Content Creation", 
                                desc: [
                                    'Understanding the digital content landscape',
                                    'Types of content and their purposes',
                                    'Content creation tools and resources'
                                ] 
                            },
                            { 
                                title: "Module 2: Content Strategy & Planning", 
                                desc: [
                                    'Developing a content strategy',
                                    'Content calendars and scheduling',
                                    'Audience research and targeting'
                                ] 
                            },
                            { 
                                title: "Module 3: Visual Content Creation", 
                                desc: [
                                    'Graphic design basics',
                                    'Image editing and optimization',
                                    'Creating engaging visual content'
                                ] 
                            },
                            { 
                                title: "Module 4: Video Content & Editing", 
                                desc: [
                                    'Video shooting techniques',
                                    'Video editing basics',
                                    'Creating engaging video content and skits'
                                ] 
                            },
                            { 
                                title: "Module 5: Social Media Management", 
                                desc: [
                                    'Platform-specific strategies',
                                    'Community management',
                                    'Analytics and performance tracking'
                                ] 
                            },
                            { 
                                title: "Module 6: Monetization & Career Growth", 
                                desc: [
                                    'Monetizing your content',
                                    'Building a personal brand',
                                    'Freelancing and career opportunities'
                                ] 
                            }
                        ].map((item, index) => (
                            <li key={index} style={{ marginBottom: '20px' }}>
                                <strong style={{ fontSize: '1.8rem' }}>{item.title}</strong>
                                <ul style={{ marginTop: '10px' }}>
                                    {item.desc.map((point, i) => (
                                        <li key={i} style={{ marginBottom: '8px', fontWeight: 500 }}>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default ContentCreation;
