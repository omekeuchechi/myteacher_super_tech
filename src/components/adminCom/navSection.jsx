import { useState } from 'react';
import { Link } from 'react-router-dom';
import './navSection.css';

const AdminNav = ({ navLinks = [], onLogout }) => {
    const [showDropdown, setShowDropdown] = useState(false);
  return (
    <nav className="admin-nav">
      <Link className="admin-logo" to="/admin/dashboard">Admin Dashboard</Link>
      {/* <input type="checkbox" id="admin-nav-toggle" className="admin-nav-toggle" />
      <label htmlFor="admin-nav-toggle" className="admin-nav-hamburger">
        <span></span>
        <span></span>
        <span></span>
      </label> */}
      <div className="admin-Task-toggle" onClick={() => setShowDropdown(!showDropdown)}>
        Actions <i className={`fas ${showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
      </div>
      <ul className="admin-nav-links" style={{ display: showDropdown ? 'block' : 'none' }}>
        {navLinks.map(link => (
          <li key={link.to}>
            <Link to={link.to} onClick={link.onClick}>
              {link.icon && <i className={link.icon}></i>}
              {link.label}
            </Link>
          </li>
        ))}
        <li onClick={onLogout} className="admin-nav-logout">
          <i className="fas fa-sign-out-alt"></i> Logout
        </li>
      </ul>
    </nav>
  );
};

export default AdminNav;