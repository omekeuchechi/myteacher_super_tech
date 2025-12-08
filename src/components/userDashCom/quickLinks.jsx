import { Link } from "react-router-dom";
import "../../assets/styles/dashboard/quickLink.css";

const QuickLinks = ({theme}) => {
    return(
        <>
            <div className={`quick-links-dash ${theme === "dark" ? "dark" : "light"}`}>
                <h1>Quick Links</h1>
                <div className={`links-gr ${theme === "dark" ? "dark" : "light"}`}>
                    <Link to="/online-class" className={`link ${theme === "dark" ? "dark" : "light"}`}>
                        <i className="fa-solid fa-chalkboard-user"></i>
                        <p>Join Live Class</p>
                    </Link>
                    <Link to="/video" className={`link ${theme === "dark" ? "dark" : "light"}`}>
                        <i className="fa-solid fa-video"></i>
                        <p>Class Videos</p>
                    </Link>
                    {/* <Link to="/assignment" className={`link ${theme === "dark" ? "dark" : "light"}`}>
                        <i className="fa-solid fa-book"></i>
                        <p>Assignment</p>
                    </Link> */}
                    <Link to="/certificates" 
                    className={`link ${theme === "dark" ? "dark" : "light"}`}>
                        <i className="fa-solid fa-certificate"></i>
                        <p>Certificates</p>
                    </Link>
                    <Link to="/apply"
                    className={`link ${theme === "dark" ? "dark" : "light"}`}>
                        <i className="fa-solid fa-plus"></i>
                        <p>Apply for a program</p>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default QuickLinks;