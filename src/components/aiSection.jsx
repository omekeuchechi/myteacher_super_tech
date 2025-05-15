import { useEffect, useRef } from "react";
import gsap from "gsap";

const AiSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".ai-badge", {
                opacity: 0,
                y: -30,
                duration: 0.7,
                delay: 0.2,
                ease: "power2.out"
            });
            gsap.from(".ai-reg-text h2", {
                opacity: 0,
                y: 40,
                duration: 0.8,
                delay: 0.4,
                ease: "power2.out"
            });
            gsap.from(".ai-benefits-list li", {
                opacity: 0,
                x: -40,
                stagger: 0.12,
                duration: 0.7,
                delay: 0.7,
                ease: "power2.out"
            });
            gsap.from(".ai-highlight-item", {
                opacity: 0,
                scale: 0.7,
                stagger: 0.15,
                duration: 0.7,
                delay: 1.2,
                ease: "back.out(1.7)"
            });
            gsap.from(".ai-cta-container", {
                opacity: 0,
                y: 30,
                duration: 0.7,
                delay: 1.7,
                ease: "power2.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        // Section 7 - AI Registration Section
        <section id="ai-registration-section" ref={sectionRef}>
            <div className="containers">
                <div className="ai-reg-content">
                    <div className="ai-reg-text">
                        <span className="ai-badge">NEW PROGRAM!</span>
                        <h2>Master AI Tools & Transform Your Career</h2>
                        <p>
                            Join our specialized AI training program and learn how to leverage artificial intelligence to:
                        </p>

                        <ul className="ai-benefits-list">
                            <li><i className="fas fa-check-circle"></i> Automate repetitive tasks & boost productivity</li>
                            <li><i className="fas fa-check-circle"></i> Create innovative solutions for complex problems</li>
                            <li><i className="fas fa-check-circle"></i> Analyze data for actionable business insights</li>
                            <li><i className="fas fa-check-circle"></i> Stay ahead in an AI-driven job market</li>
                            <li><i className="fas fa-check-circle"></i> Implement AI tools in any industry or role</li>
                        </ul>

                        <div className="ai-highlights">
                            <div className="ai-highlight-item">
                                <span className="highlight-number">94%</span>
                                <span className="highlight-text">Of graduates report career advancement</span>
                            </div>
                            <div className="ai-highlight-item">
                                <span className="highlight-number">12</span>
                                <span className="highlight-text">weeks to AI proficiency</span>
                            </div>
                            <div className="ai-highlight-item">
                                <span className="highlight-number">24/7</span>
                                <span className="highlight-text">expert support</span>
                            </div>
                        </div>

                        <div className="ai-cta-container">
                            <p className="ai-cta-text">
                                Limited spots available for our next cohort starting in <span className="countdown">14 days</span>
                            </p>
                            <a href="#" className="ai-register-btn">Register for AI Training</a>
                            <p className="early-bird">Early bird discount ends soon!</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AiSection;