import { useEffect } from "react";

const ContactUs = () => {
    useEffect(() => {
        const fadeInElements = document.querySelectorAll(".fade-in");

        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("scroll-visible");
                        observer.unobserve(entry.target); // Stop observing once visible
                    }
                });
            },
            { threshold: 0.1 } // Trigger when 10% of the element is visible
        );

        fadeInElements.forEach(element => observer.observe(element));

        // Cleanup observer on component unmount
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="contact-us">
            <h1 className="fade-in">Get in Touch</h1>
            <p className="fade-in">
                We'd love to hear from you! Whether you have questions about our courses, need assistance, or just want to say hello, feel free to reach out.
            </p>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.302497600607!2d6.989374774778846!3d4.869789540168953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069d1bf8f1bdfe7%3A0xc60033794358672c!2sMyteacher%20Institute!5e1!3m2!1sen!2sng!4v1747182311097!5m2!1sen!2sng"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Myteacher Institute Location"
            ></iframe>
            <h2 className="fade-in">Contact Us</h2>
            <form className="fade-in">
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />
                <textarea placeholder="Your Message" required></textarea>
                <button type="submit">Send Message</button>
            </form>
        </div>
    );
}

export default ContactUs;