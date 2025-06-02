import { useEffect } from "react";
import { Link } from "react-router-dom";
import HeroBoxVideo from '../assets/video/7989674-hd_1920_1080_25fps.mp4';
import '../assets/styles/herobox.css';

const HeroBox = () => {
    return(
        <div className="hero-box-section">
            <div className="hero-box-header">
                <h1>Get Profitable Digital Skills, Tech Solutions and IT Gadgets</h1>
                <Link className="btn-box" to="/dashboard">Get Started</Link>
            </div>
            <video src={HeroBoxVideo} autoPlay loop muted></video>
        </div>
    );
}

export default HeroBox;