import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import FullscreenIcon from '../userDashCom/fullscreenIcon';
import './Sidebar.css';

const NavItem = ({ icon, label, isExpanded, move, onClick, target }) => {
  return (
    <Link className="nav-item" to={move || "#"} onClick={onClick} target={target}>
      <i className={`fas fa-${icon}`}></i>
      {isExpanded && <span className="nav-label">{label}</span>}
    </Link>
  );
};

const Sidebar = ({ 
  isExpanded = true, 
  onToggle, 
  onLogout,
  showFullscreenIcon = false,
  customNavItems = null,
  className = ""
}) => {
  const navRef = useRef(null);

  const defaultNavItems = [
    { icon: "home", label: "Home", move: "/" },
    { icon: "chart-bar", label: "Dashboard", move: "/dashboard" },
    // { icon: "user", label: "Profile", move: "/profile" },
    { icon: "chalkboard-teacher", label: "Online Class", move: "/online-class" },
    { icon: "briefcase", label: "Assets", move: "/assets" },
    // { icon: "school", label: "On Site", move: "/on-site" },
    { icon: "cog", label: "Settings", move: "/settings", target: "_blank" },
    { icon: "question-circle", label: "Help", target: "_blank" },
    { icon: "right-from-bracket", label: "Log Out", onClick: onLogout }
  ];

  const navItems = customNavItems || defaultNavItems;

  return (
    <div className={`sidebar ${isExpanded ? '' : 'collapsed'} ${className}`} ref={navRef}>
      <button onClick={onToggle} className="toggle-button">
        <i className={`fas ${isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
      </button>

      <nav className="nav">
        {showFullscreenIcon && <FullscreenIcon />}
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            icon={item.icon}
            label={item.label}
            move={item.move}
            isExpanded={isExpanded}
            onClick={item.onClick}
            target={item.target}
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
export { NavItem };
