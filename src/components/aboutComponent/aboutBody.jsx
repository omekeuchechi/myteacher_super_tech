import { useEffect } from "react";

const AboutCom = () => {
    useEffect(() => {
        const aboutSection = document.querySelector(".about-section");
        const aboutCards = document.querySelectorAll(".about-card");

        aboutSection.classList.add("fade-in");

        aboutCards.forEach((card, i) => {
            setTimeout(() => card.classList.add("show"), 200 * i);
        });

        return () => {
            aboutCards.forEach(card => card.classList.remove("show"));
        };
    }, []);

    return (
        <section className="about-section fade-in">
            <h2 className="about-title">About Us</h2>
            <div className="about-cards">
                <div className="about-card">
                    <h3>Our Mission</h3>
                    <p>To empower individuals with the digital skills needed for success in the modern workforce.</p>
                </div>
                <div className="about-card">
                    <h3>Our Vision</h3>
                    <p>To be a leading provider of digital skills training, bridging the gap between education and employment.</p>
                </div>
                <div className="about-card">
                    <h3>Our Values</h3>
                    <p>Integrity, Innovation, Inclusivity, and Excellence.</p>
                </div>
            </div>
        </section>
    );
};

export default AboutCom;