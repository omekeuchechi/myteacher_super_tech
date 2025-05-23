import React, { useState } from "react";
import { Link } from "react-router-dom";
import FullscreenIcon from "../../components/userDashCom/fullscreenIcon";

const DashMobileNav = ({ theme = "light" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === "dark";

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`hamburger-btn ${isDark ? "dark" : "light"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Mobile Nav */}
      {isOpen && (
        <div className={`simple-mobile-nav ${isDark ? "dark" : "light"}`}>
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Theme: {isDark ? "Dark" : "Light"}
          </p>
          <FullscreenIcon />
          <NavItem icon="home" label="Home" move="/" isExpanded={true} />
          <NavItem icon="chart-bar" label="Dashboard" move="/dashboard" isExpanded={true} />
          <NavItem icon="chalkboard-teacher" label="Classroom" isExpanded={true} />
          <NavItem icon="briefcase" label="Assets" isExpanded={true} />
          <NavItem icon="cog" label="Settings" isExpanded={true} />
          <NavItem icon="question-circle" label="Help" isExpanded={true} />
          <NavItem icon="right-from-bracket" label="Log Out" isExpanded={true} />
        </div>
      )}

      <style jsx="true">{`
        .hamburger-btn {
          display: none;
          background: #086cca;
          border: none;
          font-size: 24px;
          position: fixed;
          padding: 8px;
          top: 0;
          left: 2px;
          z-index: 200;
        }

        .hamburger-btn.dark {
          color: white;
        }

        .hamburger-btn.light {
          color: black;
        }

        .simple-mobile-nav {
          display: flex;
          flex-direction: column;
          padding: 16px;
          border-top: 1px solid;
          position: fixed;
          bottom: 0;
          width: 100%;
          z-index: 1000;
        }

        .simple-mobile-nav.dark {
          background-color: #222;
          color: white;
          border-color: #444;
        }

        .simple-mobile-nav.light {
          background-color: #f9f9f9;
          color: #000;
          border-color: #ddd;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          border-bottom: 1px solid;
          text-decoration: none;
        }

        .simple-mobile-nav.dark .nav-item {
          color: white;
          border-color: #333;
        }

        .simple-mobile-nav.light .nav-item {
          color: black;
          border-color: #ccc;
        }

        .nav-item:hover {
          opacity: 0.85;
        }

        @media screen and (max-width: 1024px) {
          .hamburger-btn {
            display: block;
          }
        }

        @media screen and (min-width: 1025px) {
          .hamburger-btn,
          .simple-mobile-nav {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

function NavItem({ icon, label, isExpanded, move }) {
  return (
    <Link className="nav-item" to={move || "#"}>
      <i className={`fas fa-${icon}`} style={{ fontSize: "20px", marginRight: isExpanded ? "10px" : "0" }}></i>
      {isExpanded && <span>{label}</span>}
    </Link>
  );
}

export default DashMobileNav;
