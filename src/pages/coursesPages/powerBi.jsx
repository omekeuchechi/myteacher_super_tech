import React from 'react';
import Nav from "../../components/nav";
import { Link } from 'react-router-dom';
import '../../assets/styles/cr/copyright.css';

import powerBiImage from '../../assets/crimage/power-BI-myteacher-insitute.png';

const PowerBi = () => {
    return (
        <div className="copy-wrapper">
            <Nav />
            <div className="copy-container">
                <div className="copy-header">
                    <h1>Data Visualization (Power BI Data Analytics)</h1>
                    <p>Myteacher Institute Tessy School Junction, Rumuagholu, off Rumuokoro Flyover, Port Harcourt</p>
                </div>

                <div className="copy-image">
                    <img src={powerBiImage} alt="Power BI Data Analytics class" />
                </div>

                <div className="copy-side">
                    <div className="box"><span><i className="fas fa-money-bill-wave"></i> Locally</span><span>₦60,000</span></div>
                    <div className="box"><span><i className="fas fa-money-bill-wave"></i> Remote</span><span>₦20,000</span></div>
                    <div className="box"><span><i className="fas fa-bookmark"></i> Remote</span><span>Learn Online</span></div>
                    <div className="box"><span><i className="fas fa-bookmark"></i> Locally</span><span>Learn on Site</span></div>
                    <div className="box"><span><i className="fas fa-clock"></i> Duration</span><span>4 Weeks</span></div>
                    <div className="box"><span><i className="fas fa-copy"></i> Lessons</span><span>8</span></div>
                    <button className="btn local">📱 Contact to Enroll</button>
                    <button className="btn remote">💳 Enroll Now (₦60,000)</button>
                </div>

                <div className="copy-description">
                    <h2>✅ What is Power BI?</h2>

                    <div className="section">
                        <p style={{ fontSize: '1.6rem', lineHeight: '1.6', marginBottom: '20px' }}>
                            Power BI is a Visualization tool for Data Analytics. After data has been analyzed, it is then visualized for easy decision-making from the results of the analysis. A good grasp of Power BI will make you a solid business analyst that can visualize data for non-data analysts to make informed decisions.
                        </p>
                        <p style={{ fontSize: '1.6rem', lineHeight: '1.6', marginBottom: '20px' }}>
                            Power BI is a visualization tool owned by Microsoft Corporation. It can be used for data analytics and visualization.
                        </p>
                        <p style={{ fontSize: '1.6rem', lineHeight: '1.6', marginBottom: '20px' }}>
                            To get started in Data Analytics, Power BI is very important.
                        </p>
                    </div>

                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '40px 0 20px' }}>
                        POWER BI (VISUALIZATION) COURSE OUTLINE
                    </h2>

                    <ol className="benefits" style={{ fontSize: '1.6rem' }}>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}>Introduction to Power BI with a focus on the components and architecture of the Power Service.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}>Understanding the Power BI and Power Query Application Environment.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}>Identifying the data types and variable types accepted by Power BI.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}>Importing or Getting Dataset from various online sources.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}>Importing or Getting Dataset from different Offline sources or formats.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}>Transforming Datasets in Power Query.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}>Creating Relationships between tables of datasets in Power BI.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}>Performing basic DAX measures in Power BI.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}>Differentiating between the Tile, Reports, or Dashboards when working on the Canvas.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}>Creating Visualizations by drag and drop technique in Power BI.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}>Using the Power Q&A for Designing Reports with filters, Slicers, and Narratives.</li>
                        <li style={{ marginBottom: '15px', fontWeight: 600 }}>Saving and Sharing Reports.</li>
                    </ol>

                    <div className="section highlight" style={{ marginTop: '40px' }}>
                        <p style={{ fontSize: '1.6rem', lineHeight: '1.6' }}>
                            Learn Data Visualization in Port Harcourt, Lagos, Abuja, and worldwide, online, on-site, and in person. Contact <Link to="/customer-support">Myteacher Institute</Link> today.
                        </p>
                        <p style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '15px' }}>
                            Duration: 4 weeks | Fees: ₦60,000
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PowerBi;
