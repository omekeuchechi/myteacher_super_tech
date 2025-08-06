import myteacherLogo from '../../img/Untitled-1.png'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
const FooterFd = () => {
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY || window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            // Show button if scrolled past half the page or near the bottom
            setShowScrollToTop(scrollY > docHeight / 2);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return(
        <footer className="footer">
        <div className="footer-grid">
          <div className="footer-text-logo">
            <Link to='/' className='footer-link'><img src={myteacherLogo} alt="myteacherLogo" />Myteacher</Link>
            <p>Empowering the next generation of tech professionals</p>
          </div>
          <div className='footer-quick-links'>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/courses" className='footer-link'>Courses</Link></li>
              <li><Link to="/techblog" className='footer-link'>Tech Blog</Link></li>
              <li><Link to="/customer-support" className='footer-link'>Chat Us</Link></li>
              <li><Link to="/apply" className='footer-link'>Apply For a program</Link></li>
            </ul>
          </div>
          <div className='footer-contact'>
            <h4>Contact</h4>
            <p><i className='fa-solid fa-location-dot'></i> Myteacher Institute Tessy School junction Rumuagholu off Rumuokoro flyover Port Harcourt</p>
            <p><i className='fa-solid fa-phone'></i> +234 903 005 7489</p>
            <p><i className='fa-solid fa-envelope'></i> info@myteacher.com</p>
          </div>
          <div className='footer-follow-us'>
            <h4>Follow Us</h4>
            <div className="social-icons">
              <span><i className="fa-brands fa-facebook"></i></span><span><i className="fa-brands fa-twitter"></i></span><span><i className="fa-brands fa-instagram"></i></span><span><i className="fa-brands fa-linkedin"></i></span>
            </div>
          </div>
        </div>
        <div className="footer-copy">&copy; 2025 Myteacher Institute. All rights reserved.</div>
        {showScrollToTop && (
        <div className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <i className="fas fa-chevron-up"></i>
        </div>
    )}
      </footer>
    );
}

export default FooterFd;
