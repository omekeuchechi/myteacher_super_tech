import React from 'react';
import Nav from "../../components/nav";
import dataEntryImage from '../../assets/crimage/myteacher-institute-data-entry.jpg';
import { Link } from 'react-router-dom';
import '../../assets/styles/cr/copyright.css';

const DataEntry = () => {
    return (
        <div className="copy-wrapper">
            <Nav />
            <div className="copy-container">
                <div className="copy-header">
                    <h1>Data Entry</h1>
                    <p>Myteacher Institute Tessy School Junction, Rumuagholu, off Rumuokoro Flyover, Port Harcourt</p>
                </div>

                <div className="copy-image">
                    <img src={dataEntryImage} alt="Copywriting class" />
                </div>

                <div className="copy-side">
                    <div className="box"><span><i className="fas fa-money-bill-wave"></i> Locally</span><span>₦50,000</span></div>
                    <div className="box"><span><i className="fas fa-money-bill-wave"></i> Remote</span><span>₦15,000</span></div>
                    <div className="box"><span><i className="fas fa-bookmark"></i> Remote</span><span>Learn on Site</span></div>
                    <div className="box"><span><i className="fas fa-bookmark"></i> Locally</span><span>Learn on Real Location</span></div>
                    <div className="box"><span><i className="fas fa-clock"></i> Duration</span><span>5 Weeks</span></div>
                    <div className="box"><span><i className="fas fa-copy"></i> Lessons</span><span>5</span></div>
                    <button className="btn local">📱Contact to Request</button>
                    <button className="btn remote">🍵 Buy Now</button>
                </div>

                <div className="copy-description">
                    <h2>✅ Data Entry</h2>

                    <div className="section">
                        <h3>What is Data Entry?</h3>
                        <p>
                            <a href="https://medium.com/@supermoneymake/7-benefits-of-data-entry-jobs-8d66044c6dc1">Data entry</a> involves the process of entering, updating, and maintaining data in a digital format. It typically requires using software tools like spreadsheets, databases, or specialized systems to organize and store information accurately and efficiently.
                        </p>
                    </div>

                    <div className="section highlight">
                        <p>
                            Learn Data Entry in Port Harcourt, Lagos, Abuja, and worldwide, online and onsite. Contact <Link to="/">Myteacher Institute</Link> today.
                        </p>
                    </div>

                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>
                       Common Data Entry Tasks
                    </h2>

                    <ul style={{ fontSize: '1.6rem' }}>
                        <li style={{ fontWeight: 900 }}>Entering data from paper documents into digital formats.</li>
                        <li style={{ fontWeight: 900 }}>Updating and maintaining existing databases.</li>
                        <li style={{ fontWeight: 900 }}>Transcribing audio or video recordings into text.</li>
                        <li style={{ fontWeight: 900 }}>Organizing and categorizing data for easy retrieval.</li>
                        <li style={{ fontWeight: 900 }}>Organizing and cleaning data for accuracy.</li>
                        <li style={{ fontWeight: 900 }}>Creating and managing reports or records.</li>
                    </ul>


                    <p className="external-link" style={{ fontWeight: 900, fontSize: '2rem', color: '#333', textDecoration: 'none' }}>
                        ✅ Benefits of learning Data Entry
                    </p>

                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, }}>Data entry jobs are a versatile and attractive career choice, offering numerous benefits. Here are the key advantages:</h2>

                    <ol className="list">
                        <li style={{ fontWeight: 900 }}>Flexible Work Hours: <br /> 
                            <p style={{ fontWeight: 500 }}>
                                Tailor your schedule to suit your lifestyle, enabling a better work-life balance.
                            </p>
                        </li>
                        <li style={{ fontWeight: 900 }}>No Formal Education Required:
                            <br />
                            <p style={{ fontWeight: 500 }}>
                                Basic computer skills and good English are often enough, making it accessible to many.
                            </p>
                        </li>
                        <li style={{ fontWeight: 900 }}>Remote Work Opportunities:
                            <br />
                            <p style={{ fontWeight: 500 }}>
                                Work from home with reduced commuting time and increased productivity.
                            </p>
                        </li>
                        <li style={{ fontWeight: 900 }}>Steady Job Availability:
                            <br />
                            <p style={{ fontWeight: 500 }}>
                                Consistent demand ensures job stability for both freelancers and full-time employees.
                            </p>
                        </li>
                        <li style={{ fontWeight: 900 }}>Skill Enhancement
                            <br />
                            <p style={{ fontWeight: 500 }}>
                                Improve transferable skills like typing speed, accuracy, and attention to detail.
                            </p>
                        </li>
                        <li style={{ fontWeight: 900 }}>Competitive Pay:
                            <br />
                            <p style={{ fontWeight: 500 }}>
                               Working with international clients allows you to earn in stronger currencies, potentially increasing your income when converted to naira. 
                            </p>
                        </li>
                        <li style={{ fontWeight: 900 }}>Low Low Entry Costs:
                            <br />
                            <p style={{ fontWeight: 500 }}>
                               Start with minimal investment—just a computer, internet, and basic tools. 
                            </p>
                        </li>
                    </ol>

                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px' }}>These roles are ideal for individuals seeking flexibility, affordability, and skill-building while ensuring job stability and earning potential.</h2>

                    <h3 style={{ fontSize: '1.6rem' }}>✅Course outline</h3>
                    <ol className="benefits">
                        {[
                            { title: "Module 1: Introduction to Data Entry", desc: ['What is data entry and why it’s important.', 'Common tools and software like Excel and Google Sheets.',] },
                            { title: "Module 2: Essential Skills for Data EntryTools", desc: ['Typing speed and accuracy.', 'Attention to detail and time management.',] },
                            { title: "Module 3: Using Spreadsheets", desc: ['Basics of Excel and Google Sheets.', 'Formatting, formulas, and data validation.',] },
                            { title: "Module 4: Organizing and Managing Data", desc: ['Structuring data with tables.', 'Sorting, filtering, and ensuring data security.',] },
                            { title: "Module 5: Working with Databases", desc: ['Intro to databases', 'Data entry and basic queries.',] },
                            { title: "Module 6: Advanced Techniques", desc: ['Cleaning and validating data', 'Basics of automated data entry tools.',] },
                            { title: "Module 7: Hands-On Practice", desc: ['Real-world examples and exercises.', 'Completing data entry projects.',] },
                            { title: "Module 8: Career Prep", desc: ['Building a resume and portfolio.', 'Finding jobs and freelancing opportunities.',] },
                        ].map((item, index) => (
                            <li key={index}>
                                <strong>{item.title}</strong>
                                <ul><li>{item.desc.map(list => (
                                    <p key={list}>{list}</p>
                                ))}</li></ul>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default DataEntry;
