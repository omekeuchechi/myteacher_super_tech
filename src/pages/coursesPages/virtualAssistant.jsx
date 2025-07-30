import React from 'react';
import Nav from "../../components/nav";
import visualAssitantImage from '../../assets/crimage/virtual-assistant-course-at-myteacher-intitute-Port-Harcourt-Myteacher-Institute.jpg';
import { Link } from 'react-router-dom';
import '../../assets/styles/cr/copyright.css';

const VirtualAssistant = () => {
    return (
        <div className="copy-wrapper">
            <Nav />
            <div className="copy-container">
                <div className="copy-header">
                    <h1>Virtual Assistant</h1>
                    <p>Myteacher Institute Tessy School Junction, Rumuagholu, off Rumuokoro Flyover, Port Harcourt</p>
                </div>

                <div className="copy-image">
                    <img src={visualAssitantImage} alt="Copywriting class" />
                </div>

                <div className="copy-side">
                    <div className="box"><span><i className="fas fa-money-bill-wave"></i> Locally</span><span>₦60,000</span></div>
                    <div className="box"><span><i className="fas fa-money-bill-wave"></i> Remote</span><span>₦20,000</span></div>
                    <div className="box"><span><i className="fas fa-bookmark"></i> Remote</span><span>Learn on Site</span></div>
                    <div className="box"><span><i className="fas fa-bookmark"></i> Locally</span><span>Learn on Real Location</span></div>
                    <div className="box"><span><i className="fas fa-clock"></i> Duration</span><span>4 Weeks</span></div>
                    <div className="box"><span><i className="fas fa-copy"></i> Lessons</span><span>12</span></div>
                    <button className="btn local">📱Contact to Request</button>
                    <button className="btn remote">🍵 Buy Now</button>
                </div>

                <div className="copy-description">
                    <h2>✅ Virtual Assistant</h2>

                    <div className="section">
                        <h3>Who is a Virtual Assistant?</h3>
                        <p>
                            A <a href="https://therosepreneur.com/benefits-becoming-virtual-assistant/">virtual assistant (VA)</a> is an independent contractor who provides services to individuals and small and medium sized businesses via the internet.  As virtual assistants only charge for the hours they work, more and more self-employed individuals, entrepreneurs, and small business owners across all industries are reaping huge savings and benefits by hiring them.  These benefits include increased productivity, savings in office real estate space, employee benefits, training and more.
                        </p>
                    </div>

                    <div className="section highlight">
                        <p>
                            Learn Virtual Assistant in Port Harcourt, Lagos, Abuja, and worldwide, online and onsite. Contact <Link to="/customer-support">Myteacher Institute</Link> today.
                        </p>
                    </div>

                    <p className="external-link" style={{ fontWeight: 900, fontSize: '2rem', color: '#333', textDecoration: 'none' }}>
                        ✅ Benefits of Becoming a Virtual Assistant
                    </p>

                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, }}>Becoming a virtual assistant (VA) in Nigeria offers several advantages:</h2>

                    <ol className="list">
                        <li style={{ fontWeight: 900 }}>Flexible Schedule: <br /> 
                            <p style={{ fontWeight: 500 }}>
                                Work from anywhere at times that suit you, eliminating daily commutes and allowing for a better work-life balance.
                            </p>
                        </li>
                        <li style={{ fontWeight: 900 }}>Unlimited Earning Potential:
                            <br />
                            <p style={{ fontWeight: 500 }}>
                                Set your own rates and take on as many clients as you can handle, leading to potentially high earnings.
                            </p>
                        </li>
                        <li style={{ fontWeight: 900 }}>No Special Degree Required:
                            <br />
                            <p style={{ fontWeight: 500 }}>
                                Begin your VA career without the need for a university degree or specialized technical skills; existing abilities can be sufficient.
                            </p>
                        </li>
                        <li style={{ fontWeight: 900 }}>Client Selection Freedom:
                            <br />
                            <p style={{ fontWeight: 500 }}>
                                Choose clients you prefer to work with, including international ones, and avoid toxic work environments.
                            </p>
                        </li>
                        <li style={{ fontWeight: 900 }}>High Demand for Services:
                            <br />
                            <p style={{ fontWeight: 500 }}>
                                As businesses increasingly operate online, there’s a growing need for virtual assistants to manage tasks like social media, email, and administrative duties.
                            </p>
                        </li>
                        <li style={{ fontWeight: 900 }}>Opportunity to Earn in Foreign Currency:
                            <br />
                            <p style={{ fontWeight: 500 }}>
                               Working with international clients allows you to earn in stronger currencies, potentially increasing your income when converted to naira. 
                            </p>
                        </li>
                    </ol>

                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px' }}>These benefits make the virtual assistant profession an attractive option for many Nigerians seeking flexible and lucrative work opportunities,</h2>

                    <h3 style={{ fontSize: '1.6rem' }}>✅Course outline</h3>
                    <ol className="benefits">
                        {[
                            { title: "Module 1: Introduction to Virtual Assistance", desc: ['What is a Virtual Assistant?', 'Benefits of being a VA (flexibility, remote work).', 'Overview of essential tools.',] },
                            { title: " Module 2: Communication Tools", desc: ['Email Management: Gmail, Outlook.', 'Virtual Meetings: Zoom, Microsoft Teams, Google Meet.', 'Collaboration: Slack, WhatsApp, Telegram.',] },
                            { title: " Module 3: Task and Time Management Tools", desc: ['Task Management: ClickUp.', 'Time Tracking: Clockify.', 'Calendars: Google Calendar, Calendly.',] },
                            { title: " Module 4: File and Document Management Tools", desc: ['Cloud Storage: Google Drive, Dropbox, OneDrive.', 'Document Tools: Google Docs, Microsoft Word, Adobe Acrobat.', 'Spreadsheets: Google Sheets, Microsoft Excel.',] },
                            { title: " Module 5: Social Media and Content Tools", desc: ['Scheduling: Buffer', 'Content Creation: Canva,CapCut.', 'Chat Tools:, LiveChat.',] },
                            { title: "Module 6: Customer Management Tools", desc: ['CRM Systems: HubSpot,', 'Support Platforms: Zendesk.', 'Chat Tools:, LiveChat.',] },
                            { title: "Module 7: E-commerce Tools", desc: ['Online Stores: Shopify', 'Payment Systems: PayPal, Stripe, Paystack', 'Inventory Management: QuickBooks',] },
                            { title: " Module 8: Practice and Portfolio Developmen", desc: ['Simulate tasks using tools like Gmail, Trello, and Canva.', 'Create a sample portfolio to showcase skills.',] },
                        ].map((item, index) => (
                            <li key={index}>
                                <strong>{item.title}</strong>
                                <ul><li>{item.desc.map(list => (
                                    <p key={list}>{list}</p>
                                ))}</li></ul>
                            </li>
                        ))}
                    </ol>

                    <div className="project">
                        <h4>Certification and Next Steps:</h4>
                        <p>Earn a completion certificate.</p>
                        <p>Create a sample portfolio to showcase skills.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualAssistant;
