import React from 'react';
import Nav from "../../components/nav";
import copyWritingImage from '../../assets/crimage/learn-copy-writing-in-Port-Harcourt-at-myteacher-intitute.png';
import { Link } from 'react-router-dom';
import '../../assets/styles/cr/copyright.css';

const CopyRight = () => {
    return (
        <div className="copy-wrapper">
            <Nav />
            <div className="copy-container">
                <div className="copy-header">
                    <h1>Copy Writing</h1>
                    <p>Myteacher Institute Tessy School Junction, Rumuagholu, off Rumuokoro Flyover, Port Harcourt</p>
                </div>

                <div className="copy-image">
                    <img src={copyWritingImage} alt="Copywriting class" />
                </div>

                <div className="copy-side">
                    <div className="box"><span><i className="fas fa-money-bill-wave"></i> Locally</span><span>₦90,000</span></div>
                    <div className="box"><span><i className="fas fa-money-bill-wave"></i> Remote</span><span>₦30,000</span></div>
                    <div className="box"><span><i className="fas fa-bookmark"></i> Remote</span><span>Learn on Site</span></div>
                    <div className="box"><span><i className="fas fa-bookmark"></i> Locally</span><span>Learn on Real Location</span></div>
                    <div className="box"><span><i className="fas fa-clock"></i> Duration</span><span>10 Weeks</span></div>
                    <div className="box"><span><i className="fas fa-copy"></i> Lessons</span><span>10</span></div>
                    <button className="btn local">📱Contact to Request</button>
                    <button className="btn remote">🍵 Buy Now</button>
                </div>

                <div className="copy-description">
                    <h2>✅ COPY WRITING</h2>

                    <div className="section">
                        <h3>What is copywriting?</h3>
                        <p>
                            Copywriting is the art and science of writing persuasive and compelling text (copy) designed to prompt a specific action from the reader. This could be clicking a link, making a purchase, signing up for a newsletter, or engaging with a brand.
                        </p>
                    </div>

                    <div className="section highlight">
                        <p>
                            Learn Copywriting in Port Harcourt, Lagos, Abuja, and worldwide, online and onsite. Contact <Link to="/">Myteacher Institute</Link> today.
                        </p>
                    </div>

                    <a className="external-link" href="https://www.awai.com/what-is-copywriting/" target="_blank" rel="noopener noreferrer">
                        ✅ Benefits of learning Copy Writing
                    </a>

                    <ol className="list">
                        <li>Website content</li>
                        <li>Social media ads</li>
                        <li>Email campaigns</li>
                        <li>Product descriptions</li>
                        <li>Sales pages</li>
                        <li>Video scripts</li>
                        <li>Blog headlines</li>
                    </ol>

                    <h3 style={{ fontSize: '1.6rem' }}>✅ Benefits of Learning Copywriting</h3>
                    <ol className="benefits">
                        {[
                            { title: "High Demand Skill", desc: "Businesses in every industry need skilled copywriters to sell products and connect with audiences." },
                            { title: "Remote Work Opportunities", desc: "You can freelance or work from anywhere in the world." },
                            { title: "Lucrative Career Options", desc: "Specialize in SEO or direct response copy for higher pay." },
                            { title: "Improves Communication Skills", desc: "Write clearly and persuasively in all professional settings." },
                            { title: "Versatility Across Industries", desc: "From tech and healthcare to fashion and education." },
                            { title: "Boosts Your Business or Freelancing Career", desc: "Market yourself or your business more effectively." },
                            { title: "Helps You Understand Consumer Behavior", desc: "Think like your audience and improve marketing." },
                            { title: "Builds a Portfolio Quickly", desc: "Start with small projects and showcase your talent." },
                            { title: "Affordable Skill to Learn", desc: "Plenty of free and low-cost resources available." },
                            { title: "Empowers You to Influence and Persuade", desc: "Motivate people to act through writing." },
                        ].map((item, index) => (
                            <li key={index}>
                                <strong>{item.title}</strong>
                                <ul><li>{item.desc}</li></ul>
                            </li>
                        ))}
                    </ol>

                    <div className="syllabus">
                        <h3>✅ What You Will Learn:</h3>
                        {[
                            "Introduction to Copywriting",
                            "Core Copywriting Principles",
                            "Writing Compelling Copy",
                            "Copywriting for Different Platforms",
                            "More Platforms",
                            "Editing and Refining Copy",
                            "Copywriting for Business Success",
                            "Practical Projects and Portfolio Building",
                            "Final Assessment and Certification"
                        ].map((mod, i) => (
                            <p key={i}>Module {i + 1}: {mod}</p>
                        ))}
                    </div>

                    <div className="project">
                        <h4>Capstone Project</h4>
                        <p>Develop a full campaign for a mock or real product.</p>
                        <h4>Certification</h4>
                        <p>Award of completion upon passing the final assessment.</p>
                    </div>

                    <div className="final-info">
                        <h2>DURATION: 4 WEEKS</h2>
                        <h3>FEES: ₦60,000</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CopyRight;
