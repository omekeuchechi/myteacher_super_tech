import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

const HeroSection = () => {
    return(
        <header className="hero-section">
            <div className="hero-content">
                <h1>Profitable Digital Skills, Tech Solutions and IT Gadgets</h1>
                {/* <a href="/dashboard" className="btn">Get Started</a> */}
                <Link className="btn" to="/dashboard">Get Started</Link>
            </div>
        </header>
    );
};

export default HeroSection;