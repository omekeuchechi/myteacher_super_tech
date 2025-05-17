import { useEffect } from "react";
import myteacherFooterLogo from "../img/Untitled-1.png";

const Footer = () => {
    useEffect(() => {
        const scrollToTopBtn = document.querySelector(".scroll-to-top");
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };

        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener("click", scrollToTop);
        }

        return () => {
            if (scrollToTopBtn) {
                scrollToTopBtn.removeEventListener("click", scrollToTop);
            }
        };
    }, []);

    return (
        // Footer Section
        <footer className="footer">
            <div className="footer-content">
                <h2>
                    <img src={myteacherFooterLogo} alt="Myteacher Logo" /> Myteacher
                </h2>
                <p>Empowering you with the skills to succeed in the digital world.</p>
                <div className="socials">
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-whatsapp"></i></a>
                </div>
            </div>
            <div className="footer-links">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="/">Home</a></li>
                    {/* <li><a href="#">About</a></li> */}
                    <li><a href="#">Courses</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Tech Blog</a></li>
                </ul>
            </div>
            <div className="scroll-to-top">
                <i className="fas fa-chevron-up"></i>
            </div>
            {/* <div className="footer-credits">
                <p>Designed by <a href="#">Omeke Joseph</a> and <a href="#">Teresar</a></p>
                <p>Developed by <a href="#">Omeke Joseph</a> and <a href="#">Teresar</a></p>
                <p>Powered by <a href="#">Myteacher Intitute</a></p>
            </div> */}
            {/* <div className="footer-privacy">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
            </div> */}
            <div className="address-info-footer">
                <h2><span>Tel:</span> 09030057489</h2>
                <address>
                    Myteacher Intitute #14 Rumuaghulo road Tessy school junction, Rumuaghulo off Romuokoro flyover Port Harcourt River state
                </address>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Myteacher. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;