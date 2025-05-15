import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import dataAnalisImg from '../assets/images/dataAnaylsisImg1.webp';
import webDevImg from '../assets/images/webDevimg1.webp';
import portfolioImg from '../assets/images/cyberSecurityImg1.webp';
import personalClassImg from '../assets/images/privateClassesImg.webp';

const Services = () => {
    const sectionRef = useRef(null);

    useGSAP(() => {
        gsap.from(".section-header h2", {
            opacity: 0,
            y: -40,
            duration: 0.7,
            delay: 0.2,
            ease: "power2.out"
        });
        gsap.from(".section-header p", {
            opacity: 0,
            y: 30,
            duration: 0.7,
            delay: 0.4,
            ease: "power2.out"
        });
        gsap.from(".service-card", {
            opacity: 0,
            y: 50,
            stagger: 0.18,
            duration: 0.8,
            delay: 0.7,
            ease: "power2.out"
        });
        gsap.from(".contact-btn", {
            opacity: 0,
            scale: 0.8,
            duration: 0.7,
            delay: 1.3,
            ease: "back.out(1.7)"
        });
    }, { scope: sectionRef });

    return (
        <section id="services-section" className="fade-in" ref={sectionRef}>
            <div className="containers">
                <div className="section-header">
                    <h2>Our Services</h2>
                    <p>
                        Beyond our courses, we offer additional services to support your tech career
                        journey from start to finish.
                    </p>
                </div>

                <div className="services-container">
                    <div className="service-row">
                        <div className="service-card">
                            <div className="service-image">
                                <img
                                    src={dataAnalisImg}
                                    alt="Career Counseling"
                                    className="service-icon-img"
                                />
                            </div>
                            <div className="service-content">
                                <div className="service-accent">01</div>
                                <h3 className="service-title">Career Counseling</h3>
                                <p className="service-description">
                                    Receive personalized career guidance from industry professionals
                                    who understand the tech landscape. We'll help you map out a clear path
                                    toward your dream tech role.
                                </p>
                                <a href="#" className="service-cta">Learn More</a>
                            </div>
                        </div>

                        <div className="service-card">
                            <div className="service-image">
                                <img
                                    src={webDevImg}
                                    alt="Job Placement"
                                    className="service-icon-img"
                                />
                            </div>
                            <div className="service-content">
                                <div className="service-accent">02</div>
                                <h3 className="service-title">Job Placement</h3>
                                <p className="service-description">
                                    Gain access to our exclusive network of hiring partners and get
                                    matched with positions at top companies. Our placement specialists
                                    will help prepare you for interviews.
                                </p>
                                <a href="#" className="service-cta">Learn More</a>
                            </div>
                        </div>
                    </div>

                    <div className="service-row">
                        <div className="service-card">
                            <div className="service-image">
                                <img
                                    src={portfolioImg}
                                    alt="Portfolio Review"
                                    className="service-icon-img"
                                />
                            </div>
                            <div className="service-content">
                                <div className="service-accent">03</div>
                                <h3 className="service-title">Portfolio Review</h3>
                                <p className="service-description">
                                    Have your work evaluated by industry experts who will provide
                                    detailed, constructive feedback to help you showcase your skills
                                    effectively to potential employers.
                                </p>
                                <a href="#" className="service-cta">Learn More</a>
                            </div>
                        </div>

                        <div className="service-card">
                            <div className="service-image">
                                <img
                                    src={personalClassImg}
                                    alt="Tech Consultation"
                                    className="service-icon-img"
                                />
                            </div>
                            <div className="service-content">
                                <div className="service-accent">04</div>
                                <h3 className="service-title">Tech Consultation</h3>
                                <p className="service-description">
                                    Get expert advice on technical challenges or project implementation
                                    from our team of experienced developers and designers who can help
                                    solve your specific problems.
                                </p>
                                <a href="#" className="service-cta">Learn More</a>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="contact-btn">Contact Us</button>
            </div>
        </section>
    );
};

export default Services;