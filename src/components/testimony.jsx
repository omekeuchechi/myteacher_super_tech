import { useEffect } from "react";
import DImage35 from "../img/download (35).jpeg";
import DImage36 from "../img/download (36).jpeg";
import DImage37 from "../img/download (37).jpeg";
import DImage38 from "../img/download (38).jpeg";
import DImage39 from "../img/download (39).jpeg";
import DImage40 from "../img/download (40).jpeg";
import DImage41 from "../img/download (41).jpeg";

const Testimony = () => {
    useEffect(() => {
        const handleScroll = () => {
            const elements = document.querySelectorAll('.fade-in');
            elements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    element.classList.add('visible');
                } else {
                    element.classList.remove('visible');
                }
            });
        };

        const container = document.querySelector('.tes-containers');
        let position = 0;
        let direction = 1;

        function sweepTestimonials() {
            if (!container) return;
            position += direction * 300;
            container.style.transform = `translateX(${position}px)`;

            if (position > 0 || Math.abs(position) >= container.scrollWidth - container.clientWidth) {
                direction *= -1;
            }
        }

        const intervalId = setInterval(sweepTestimonials, 3000);

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="sweeper-wrapper fade-in">
            <section id="testimonials">
                <div className="tes-header">
                    <h2>What Our Students Say</h2>
                    <p>Hear from our successful students who have transformed their careers with us.</p>
                </div>
                <div className="sweeper">
                    <div className="tes-containers">
                        <div className="testimonial-card">
                            <img src={DImage35} alt="Testimonial from Obi James" />
                            <p>"The digital skills bootcamp was a game-changer for my career. I landed my dream job within weeks of completing the course!"</p>
                            <h4>Obi James</h4>
                        </div>
                        <div className="testimonial-card">
                            <img src={DImage37} alt="Testimonial from Obi James" />
                            <p>"The digital skills bootcamp was a game-changer for my career. I landed my dream job within weeks of completing the course!"</p>
                            <h4>Obi James</h4>
                        </div>
                        <div className="testimonial-card">
                            <img src={DImage36} alt="Testimonial from Obi James" />
                            <p>"The digital skills bootcamp was a game-changer for my career. I landed my dream job within weeks of completing the course!"</p>
                            <h4>Obi James</h4>
                        </div>
                        <div className="testimonial-card">
                            <img src={DImage38} alt="Testimonial from Obi James" />
                            <p>"The digital skills bootcamp was a game-changer for my career. I landed my dream job within weeks of completing the course!"</p>
                            <h4>Obi James</h4>
                        </div>
                        <div className="testimonial-card">
                            <img src={DImage39} alt="Testimonial from Mason Grace" />
                            <p>"The instructors were knowledgeable and supportive. I highly recommend this program to anyone looking to upskill."</p>
                            <h4>Mason Grace</h4>
                        </div>
                        <div className="testimonial-card">
                            <img src={DImage40} alt="Testimonial from Amaka Joy" />
                            <p>"The instructors were knowledgeable and supportive. I highly recommend this program to anyone looking to upskill."</p>
                            <h4>Amaka Joy</h4>
                        </div>
                        <div className="testimonial-card">
                            <img src={DImage35} alt="Testimonial from Simon Grace" />
                            <p>"The instructors were knowledgeable and supportive. I highly recommend this program to anyone looking to upskill."</p>
                            <h4>Simon Grace</h4>
                        </div>
                        <div className="testimonial-card">
                            <img src={DImage39} alt="Testimonial from Paul Grace" />
                            <p>"The instructors were knowledgeable and supportive. I highly recommend this program to anyone looking to upskill."</p>
                            <h4>Paul Grace</h4>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Testimony;