import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import dataAnalisImg from '../assets/images/dataAnaylsisImg1.webp';
import webDevImg from '../assets/images/webDevimg1.webp';
import portfolioImg from '../assets/images/cyberSecurityImg1.webp';
import personalClassImg from '../assets/images/privateClassesImg.webp';


// illustrations image import
import itSolutionImage from '../assets/illustrations/cop.jpg';
import gadjectImage from '../assets/illustrations/tech_gadject.jpg';
import corporate from '../assets/illustrations/copera.jpg';
import basicImage from '../assets/illustrations/basicla.jpg';

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
                                    src={basicImage}
                                    alt="Career Counseling"
                                    className="service-icon-img"
                                />
                            </div>
                            <div className="service-content">
                                <div className="service-accent">01</div>
                                <h3 className="service-title">School of Computing</h3>
                                <p className="service-description">
                                    We equip students and professionals with essential digital skills through hands-on training in modern computing. Our programs are designed to build competence, confidence, and creativity in today’s tech-driven world.
                                </p>
                                {/* <a href="#" className="service-cta">Learn More</a> */}
                            </div>
                        </div>

                        <div className="service-card">
                            <div className="service-image">
                                <img
                                    src={itSolutionImage}
                                    alt="Job Placement"
                                    className="service-icon-img"
                                />
                            </div>
                            <div className="service-content">
                                <div className="service-accent">02</div>
                                <h3 className="service-title">IT Solutions & Consultancy</h3>
                                <p className="service-description">
                                    We provide tailored IT solutions and expert consulting to help businesses improve efficiency and stay competitive. From strategy to implementation, we're with you every step of your digital transformation.
                                </p>
                                {/* <a href="#" className="service-cta">Learn More</a> */}
                            </div>
                        </div>
                    </div>

                    <div className="service-row">
                        <div className="service-card">
                            <div className="service-image">
                                <img
                                    src={gadjectImage}
                                    alt="Portfolio Review"
                                    className="service-icon-img"
                                />
                            </div>
                            <div className="service-content">
                                <div className="service-accent">03</div>
                                <h3 className="service-title">Tech Gadgets</h3>
                                <p className="service-description">
                                    We provide a range of reliable and affordable tech gadgets—from work tools to learning devices. Every product is selected to enhance productivity, learning, and everyday tech experiences.
                                </p>
                                {/* <a href="#" className="service-cta">Learn More</a> */}
                            </div>
                        </div>

                        <div className="service-card">
                            <div className="service-image">
                                <img
                                    src={corporate}
                                    alt="Tech Consultation"
                                    className="service-icon-img"
                                />
                            </div>
                            <div className="service-content">
                                <div className="service-accent">04</div>
                                <h3 className="service-title">Corporate Trainings</h3>
                                <p className="service-description">
                                    We empower teams with essential digital skills and tools to drive growth and innovation, helping organizations stay competitive.
                                </p>
                                {/* <a href="#" className="service-cta">Learn More</a> */}
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