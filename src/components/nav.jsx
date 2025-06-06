import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import NavLogo from '../img/Untitled-1.png';
import { Link } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();

  // navigation section

  const handleRegisterClick = () => {
    navigate('/auth');
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleHomeClick = () => {
    navigate('/')
  }

  const handleCoursesClick = () => {
    navigate('/courses')
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
        <li onClick={handleHomeClick}><Link to="/">Home</Link></li>
        {/* <li><a href="#">About Us</a></li> */}
        <li onClick={handleCoursesClick}><Link to="/courses">Courses</Link></li>
        {/* <li><Link to="#">Contact Us</Link></li> */}
        <li><Link to="#">Tech Blog</Link></li>
        <li className="nav-link-hide" onClick={handleLoginClick}><Link to="">Login</Link></li>
        <li className="nav-link-hide" onClick={handleRegisterClick}><Link to="">Register for a programme</Link></li>
      </ul>
      <div className="auth">
        <Link to="/login" className="login active">Login</Link>
        <Link to="/auth" className="signup">Register for a programme</Link>
      </div>
    </nav>
  );
};

export default Nav;