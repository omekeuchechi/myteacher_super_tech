import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/onSite/dash.css";
const OnSite = () => {
    useEffect(() => {
        document.title = "MyTeacher Onsite Platform";
    }, []);
    const [actionToggle, setActionToggle] = useState(false);
    return(
        <>
            <div className="onsite-container">
                <div className="welcome-container">
                    <h2>Welcome to MyTeacher Onsite Platform</h2>
                    <div className="welcome-text">
                        <span >⚠ MyTeacher Onsite Platform is a platform for onsite training student if you find your self using this it means you are a student of MyTeacher Institute Onsite training Platform</span>
                    </div>
                    <div className="actions">
                        <span onClick={() => setActionToggle(!actionToggle)}>Actions <i className="fa-solid fa-arrow-down"></i></span>
                        <ul style={{ display: actionToggle ? "block" : "none" }}>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/courses">Courses</Link></li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li>
                                <Link to="/">Report Bug</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="main-container">
                <div className="asset-container">
                    Assets
                </div>
                <div className="quick-action-container">
                    <h2>Quick Actions</h2>
                    <div><i className="fa-solid fa-bell"></i> Annoucment</div>
                    <div><i className="fa-solid fa-tasks"></i> Project</div>
                    <div><i className="fa-solid fa-file"></i> Report</div>
                </div>
                </div>
            </div>
        </>
    )
}

export default OnSite;