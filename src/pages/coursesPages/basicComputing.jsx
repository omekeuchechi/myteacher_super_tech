import React from 'react';
import Nav from "../../components/nav";
import basicComputingImage from '../../assets/crimage/learn-basic-computing-in-port-harcourt-myteacher-intitute.png';
import { Link } from 'react-router-dom';
import '../../assets/styles/cr/copyright.css';

const BasicComputing = () => {
    return (
        <div className="copy-wrapper">
            <Nav />
            <div className="copy-container">
                <div className="copy-header">
                    <h1>Basic Computing</h1>
                    <p>Myteacher Institute Tessy School Junction, Rumuagholu, off Rumuokoro Flyover, Port Harcourt</p>
                </div>

                <div className="copy-image">
                    <img src={basicComputingImage} alt="Copywriting class" />
                </div>

                <div className="copy-side">
                    <div className="box"><span><i className="fas fa-money-bill-wave"></i> Locally</span><span>₦70,000</span></div>
                    <div className="box"><span><i className="fas fa-money-bill-wave"></i> Remote</span><span>₦25,000</span></div>
                    <div className="box"><span><i className="fas fa-bookmark"></i> Remote</span><span>Learn on Site</span></div>
                    <div className="box"><span><i className="fas fa-bookmark"></i> Locally</span><span>Learn on Real Location</span></div>
                    <div className="box"><span><i className="fas fa-clock"></i> Duration</span><span>4.5 Weeks</span></div>
                    <div className="box"><span><i className="fas fa-copy"></i> Lessons</span><span>13</span></div>
                    <button className="btn local">📱Contact to Request</button>
                    <button className="btn remote">🍵 Buy Now</button>
                </div>

                <div className="copy-description">
                    <h2>✅ Basic Computing</h2>

                    <div className="section">
                        <p>
                            The first step in getting to tech is by understanding the fundamentals in the use of Computer. Basic Computing refers to foundational knowledge and skills related to using computers and their applications. It involves understanding how computers work, navigating operating systems, and using essential software tools to accomplish everyday tasks.
                            It is important and necessary to get into tech with a solid computer training foundation.
                        </p>
                    </div>

                    <div className="section highlight">
                        <p>
                            Learn Basic Computing in Port Harcourt, Lagos, Abuja, and worldwide, online and onsite. Contact <Link to="/customer-support">Myteacher Institute</Link> today.
                        </p>
                    </div>

                    <p className="external-link" style={{ fontWeight: 900, fontSize: '2rem', color: '#333', textDecoration: 'none' }}>
                        ✅What you will learn
                    </p>

                    <ol className="list">
                        <li style={{ fontWeight: '900', }}>Key Components of Basic Computing:</li>
                        <li>Understanding hardware (monitor, keyboard, mouse, etc.) and software.</li>
                        <li>Knowing how a computer processes and stores information.</li>
                        <li>Operating systems like Windows, macOS, or Linux involve navigating the system and managing files, folders, and basic settings.</li>
                        <li>Software applications include Microsoft Word, PowerPoint, Microsoft Excel, and basic CorelDRAW graphics.</li>
                        <li>Internet and email involve browsing the internet safely and efficiently, as well as setting up and using email for communication.</li>
                        <li>Typing skills involve learning to use the keyboard effectively for data entry and writing.</li>
                        <li>File management entails organizing, saving, and backing up files.</li>
                    </ol>

                </div>
            </div>
        </div>
    );
};

export default BasicComputing;
