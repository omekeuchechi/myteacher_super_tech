import { useEffect, useContext, useState, useRef } from "react";
import { AuthContext } from './../../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import NavLogo from '../img/Untitled-1.png';
import { Link } from "react-router-dom";

const Nav = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // navigation section
  const handleRegisterClick = () => {
    navigate('/auth');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleCoursesClick = () => {
    navigate('/courses');
  };

  const handleUserDashboardClick = () => {
    navigate('/dashboard');
  };
  const handleUserAdminDashboardClick = () => {
    navigate('/admin/dashboard');
  };

  // Dropdown close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

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
        <li onClick={handleCoursesClick}><Link to="/courses">Courses</Link></li>
        <li><Link to="/techblog">Tech Blog</Link></li>
        <li><Link to="/customer-support">Chat us</Link></li>
        <li><Link to="/apply">Apply for a programme</Link></li>
        {!user?.isVerified ? (
          <>
            <li className="nav-link-hide" onClick={handleLoginClick}><Link to="/login">Login</Link></li>
            <li className="nav-link-hide" onClick={handleRegisterClick}><Link to="/auth">Register for a programme</Link></li>
          </>
        ) : (
          <>
            <li className="nav-link-hide"
              onClick={() => {
                if (user.isAdmin) {
                  navigate("/admin/dashboard");
                } else {
                  navigate("/dashboard");
                }
              }}
            >
              <Link to={user.isAdmin ? "/admin/dashboard" : "/dashboard"}>Dashboard</Link>
            </li>
            <li className="nav-link-hide"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <span style={{ color: "#d32f2f", fontWeight: "bold", cursor: "pointer", fontSize: 20 }}>
                <i className="fas fa-sign-out-alt" style={{ marginRight: 8, marginLeft: 10 }}></i>
                Logout
              </span>
            </li>
          </>
        )}
      </ul>
      <div className="auth">
        {!user?.isVerified ? (
          <>
            <Link to="/login" className="login active">Login</Link>
            <Link to="/auth" className="signup">Register for a programme</Link>
          </>
        ) : (
          <div className="user-dropdown" ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
            <button
              className="user-dropdown-btn"
              onClick={() => setDropdownOpen((open) => !open)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 16,
                display: "flex",
                alignItems: "center"
              }}
            >
              <i className="fas fa-user" style={{ marginRight: 8 }}></i>
              {user.name || user.email}
              <i className="fas fa-caret-down" style={{ marginLeft: 8 }}></i>
            </button>
            {dropdownOpen && (
              <div
                className="dropdown-menu"
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  borderRadius: 4,
                  minWidth: 160,
                  zIndex: 1000
                }}
              >
                {/* Dashboard link */}
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (user.isAdmin) {
                      navigate("/admin/dashboard");
                    } else {
                      navigate("/dashboard");
                    }
                  }}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "10px 16px",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#1976d2",
                    fontWeight: "bold"
                  }}
                >
                  <i className="fas fa-tachometer-alt" style={{ marginRight: 8 }}></i>
                  Dashboard
                </button>
                {/* Logout button */}
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                    navigate("/login");
                  }}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "10px 16px",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#d32f2f",
                    fontWeight: "bold"
                  }}
                >
                  <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;