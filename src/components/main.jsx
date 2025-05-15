import { useState } from "react";
import MainImage from '../img/myteacher_main.jpeg';
import myteacherLogo from '../img/untitled-1.png';

const Main = () => {
    const [clicked, setClicked] = useState(false);

    const handleBtnClick = (e) => {
        e.preventDefault();
        setClicked((prev) => !prev); // Toggle on each click
    };

    return (
        <div className="main fade-in">
            <img 
                src={MainImage} 
                alt="Digital Skills Bootcamp 2025" 
            />
            <div className="main-content">
                <h2>Digital Skills Bootcamp 2025</h2>
                <p>
                    Unlock opportunities this new year by learning and mastering a digital skill. 
                    In today’s world, mastering digital skills is essential for landing great jobs 
                    and advancing your career. Learn high-demand digital skills such as AI, Coding, 
                    Data Analytics, Basic Computing, Programming, Web Development, Web Design, 
                    Graphics Design, Social Media Management, Cybersecurity, UI/UX Design, Mobile 
                    App Development, Python, Content Creation, Digital Marketing, Project Management, 
                    Virtual Assistant, AI (Artificial Intelligence), and much more.
                </p>
                <a
                    href="#"
                    className={`btn enroll-btn${clicked ? " clicked" : ""}`}
                    onClick={handleBtnClick}
                >
                    <span className={`enroll-text${clicked ? " slide-out" : ""}`}>Enroll now</span>
                    <img
                        src={myteacherLogo}
                        alt=""
                        className={`logo-animate${clicked ? " show" : ""}`}
                        style={{ display: clicked ? "inline-block" : "none" }}
                    />
                </a>
            </div>
        </div>
    );
};

export default Main;