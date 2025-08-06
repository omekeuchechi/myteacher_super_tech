import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from "../../../context/Authcontext";
import introImg from "../../assets/svg/video_play_backdrop.png"

const HeroFd = () => {
    const { user } = useContext(AuthContext);
    return (
        <div className="hero-fd" style={{marginTop: 100}}>
            <div className="hero-fd-content">
                <h1>Welcome to Myteacher Institute</h1>
                <p>Learn. Grow. Succeed — From Anywhere.</p>
                <div className="hero-content">
                    <span>The Myteacher Institute is a tech school aimed at equipping you with digital and technology skills for professional advancement through both online and in-person mentoring</span>
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
            </div>
            <div className="intro">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/gP2rarK9pSs?si=lEj7vk6gw1M5kMpg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
        </div>
    );
}

export default HeroFd;