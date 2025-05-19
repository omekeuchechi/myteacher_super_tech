import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

const HeroSection = () => {
    return(
        <header className="hero-section">
            <div className="hero-content">
                <h1>Profitable Digital Skills, Tech Solutions and IT Gadgets</h1>
                <a href="/About" className="btn">Get Started</a>
            </div>
        </header>
    );
};

export default HeroSection;