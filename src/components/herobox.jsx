import { useEffect, useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import { Link } from "react-router-dom";
import HeroBoxVideo from '../assets/video/7989674-hd_1920_1080_25fps.mp4';
import '../assets/styles/herobox.css';

const HeroBox = () => {
    const { user } = useContext(AuthContext);
    useEffect(() => {
        const fadeInElements = document.querySelectorAll(".fade-in");

        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("scroll-visible");
                        observer.unobserve(entry.target); // Stop observing once visible
                    }
                });
            },
            { threshold: 0.1 } // Trigger when 10% of the element is visible
        );

        fadeInElements.forEach(element => observer.observe(element));

        // Cleanup observer on component unmount
        return () => {
            observer.disconnect();
        };
    }, []);
    return(
        <div className="hero-box-section fade-in">
            <div className="hero-box-header" style={{ zIndex: 1 }}>
                <h1 style={{ fontFamily: 'verdana', fontWeight: 900 }}>Welcome to your dashboard. Do you want an online Live class/Training. Simply Apply here to get started</h1>
                { user ? (
                    <>
                    {user.isAdmin ? (
                        <Link className="btn-box" to="/admin/dashboard">Manage Site</Link>
                    ) : (
                        <Link className="btn-box" to="/dashboard">Dashboard</Link>
                    )}
                    </>
                ) : (
                <Link className="btn-box" to="/auth">Get Started</Link>
                )}
            </div>
            <video src={HeroBoxVideo} autoPlay loop muted></video>
        </div>
    );
}

export default HeroBox;