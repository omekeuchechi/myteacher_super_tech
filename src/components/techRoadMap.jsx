import { useEffect } from "react";

const TechRoadMap = () => {
    return (
        // How to Get Into Tech Section
        <section id="tech-journey-section" className="fade-in">
            <div className="containers">
                <div className="section-header3">
                    <h2>How to Get Into Tech</h2>
                    <p>
                        Your roadmap to a successful career in technology - follow these proven steps to break into the
                        industry with confidence.
                    </p>
                </div>

                <div className="journey-steps">
                    <div className="journey-step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h3>Discover Your Path</h3>
                            <p>
                                Explore various tech disciplines to find the one that aligns with your interests and
                                strengths. From coding to design, data science to cybersecurity - there's a perfect fit for
                                everyone.
                            </p>
                        </div>
                    </div>

                    <div className="journey-step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h3>Learn Essential Skills</h3>
                            <p>
                                Gain the fundamental knowledge and technical skills required for your chosen field through
                                structured courses, hands-on projects, and practical applications.
                            </p>
                        </div>
                    </div>

                    <div className="journey-step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3>Build Your Portfolio</h3>
                            <p>
                                Create showcase-worthy projects that demonstrate your abilities to potential employers. A
                                strong portfolio speaks louder than any credential.
                            </p>
                        </div>
                    </div>

                    <div className="journey-step">
                        <div className="step-number">4</div>
                        <div className="step-content">
                            <h3>Network & Connect</h3>
                            <p>
                                Join tech communities, attend events, and build relationships with industry professionals who
                                can provide guidance, mentorship, and potential job opportunities.
                            </p>
                        </div>
                    </div>

                    <div className="journey-step">
                        <div className="step-number">5</div>
                        <div className="step-content">
                            <h3>Land Your First Role</h3>
                            <p>
                                Apply strategic job-hunting techniques, prepare for technical interviews, and position
                                yourself effectively to secure that crucial first position in the tech industry.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="journey-cta">
                    <p>Ready to begin your tech journey?</p>
                    <button className="journey-btn">Start Your Tech Career Today</button>
                </div>
            </div>
        </section>
    );
};

export default TechRoadMap;