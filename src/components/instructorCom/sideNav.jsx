import { Link, useLocation } from 'react-router-dom';
import NavLogo from '../../img/Untitled-1.png';
import './sideNav.css';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const SideNav = ({ isMobileMenuOpen, onMenuToggle }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Close mobile menu when route changes
    useEffect(() => {
        if (onMenuToggle) {
            onMenuToggle(false);
        }
    }, [location, onMenuToggle]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isMobileMenuOpen && 
                !e.target.closest('.instructor-side-nav') && 
                !e.target.closest('.menu-toggle')) {
                onMenuToggle(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen, onMenuToggle]);

    // Navigation items
    const navItems = [
        { path: "/instructor/dashboard", icon: "fas fa-tachometer-alt", label: "Dashboard", isSubNav: false },
        {
            path: "/instructor/courses", 
            icon: "fas fa-book", 
            label: "My Courses", 
            isSubNav: true, 
            subNavItems: [
                { path: "/instructor/courses", icon: "fas fa-book", label: "My Courses" },
                { path: "/instructor/mycourses", icon: "fas fa-chalkboard-teacher", label: "View Courses" },
                { path: "/instructor/createcourse", icon: "fas fa-plus", label: "Create Courses" },
                { path: "/instructor/lecture-room", icon: "fas fa-video", label: "Attend Lecture" }
            ]
        },
        { path: "/instructor/assets", icon: "fas fa-upload", label: "Upload assets", isSubNav: false },
        { path: "/instructor/videos", icon: "fas fa-video", label: "Upload videos", isSubNav: false },
        { path: "/instructor/settings", icon: "fas fa-cog", label: "Settings", isSubNav: false }
    ];

    return (
        <>
            <button
                className="menu-toggle"
                onClick={() => onMenuToggle(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <aside className={`instructor-side-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="logo">
                    <img src={NavLogo} alt="MyTeacher Logo" />
                    <h1>Myteacher</h1>
                </div>

                <ul className="nav-ul">
                    {navItems.map((item, index) => (
                        <li
                            key={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            style={{ '--i': index }}
                        >
                            <Link
                                to={item.path}
                                className={item.isSubNav ? 'has-subnav' : ''}
                                onClick={(e) => {
                                    if (item.isSubNav) {
                                        e.preventDefault();
                                        // Toggle subnav visibility
                                        const subNav = e.currentTarget.nextElementSibling;
                                        if (subNav) {
                                            subNav.style.maxHeight = subNav.style.maxHeight ? null : '500px';
                                        }
                                    }
                                }}
                            >
                                <i className={item.icon}></i>
                                <span>{item.label}</span>
                            </Link>

                            {item.isSubNav && (
                                <div className="sub-nav">
                                    <ul>
                                        {item.subNavItems.map((subItem, subIndex) => (
                                            <li key={subIndex}>
                                                <Link to={subItem.path}>
                                                    <i className={subItem.icon}></i>
                                                    <span>{subItem.label}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                <button
                    onClick={handleLogout}
                    className="logout-btn"
                >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            </aside>
        </>
    );
};

export default SideNav;