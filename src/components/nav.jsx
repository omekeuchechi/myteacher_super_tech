import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import NavLogo from '../img/Untitled-1.png';

const Nav = () => {
  const navigate = useNavigate();

  // navigation section

  const handleRegisterClick = () => {
    navigate('/auth');
  }

  const handleLoginClick = () => {
    navigate('/login')
  }
  useEffect(() => {
    const navUl = document.querySelector('.nav-ul');
    const navLiHide = document.querySelectorAll('.nav-link-hide');
    const btnShowNav = document.getElementById('menu-icon');
    const btnNavIcon = document.querySelector('.fa-bars');

    if (btnShowNav) {
      const toggleNav = () => {
        navUl.classList.toggle('nav-ul-show');
        btnNavIcon.classList.toggle('fa-xmark');
        btnShowNav.classList.toggle('menu-icon-show');
        btnNavIcon.classList.toggle('fa-bars');
        navLiHide.forEach((li) => {
          li.classList.toggle('nav-link-hide-show');
        });
      };

      btnShowNav.addEventListener('click', toggleNav);

      // Cleanup event listener on component unmount
      return () => {
        btnShowNav.removeEventListener('click', toggleNav);
      };
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={NavLogo} alt="Myteacher Logo" />
        <h1>Myteacher</h1>
      </div>
      <div className="menu-icon" id="menu-icon">
        <i className="fas fa-bars"></i>
      </div>
      <ul className="nav-ul">
        <li><a href="/">Home</a></li>
        {/* <li><a href="#">About Us</a></li> */}
        <li><a href="#">Courses</a></li>
        <li><a href="#">Contact Us</a></li>
        <li><a href="#">Tech Blog</a></li>
        <li className="nav-link-hide" onClick={handleLoginClick}><a href="">Login</a></li>
        <li className="nav-link-hide" onClick={handleRegisterClick}><a href="">Register for a programme</a></li>
      </ul>
      <div className="auth">
        <a href="" className="login active" onClick={handleLoginClick}>Login</a>
        <a href="" className="signup" onClick={handleRegisterClick}>Register for a programme</a>
      </div>
    </nav>
  );
};

export default Nav;