import React from 'react';
import { Link } from 'react-router-dom';
import './navSection.css';

const AdminNav = ({ navLinks = [], onLogout }) => {
  return (
    <nav className="admin-nav">
      <Link className="admin-logo" to="/admin/dashboard">Admin Dashboard</Link>
      <input type="checkbox" id="admin-nav-toggle" className="admin-nav-toggle" />
      <label htmlFor="admin-nav-toggle" className="admin-nav-hamburger">
        <span></span>
        <span></span>
        <span></span>
      </label>
      <ul className="admin-nav-links">
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