import { useState } from "react";
import Nav from "../../components/nav";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../../assets/styles/buy_course.css";

// images
import BabylonJsImage from "../../assets/images/myteacher_institute_babylonJs.jpg";
import ReactFundamentalsImage from "../../assets/images/myteacher_institute_react_course.png";
import ResponsiveDesignImage from "../../assets/images/myteacher_institute_responsive_website_course.png";

// Course data
const coursesData = [
    {
        name: "BabylonJs",
        description: "Learn 3D web development with Babylon.js - create stunning 3D applications, games, and interactive experiences for the web using this powerful JavaScript framework.",
        image: BabylonJsImage,
        certification: "Certification",
        ExpireDate: "2 Month After Purchase",
        price: "₦2,500.00"
    },
    {
        name: "React Fundamentals",
        description: "Learn the fundamentals of React.js - the popular JavaScript framework for building user interfaces.",
        image: ReactFundamentalsImage,
        certification: "Certification",
        ExpireDate: "6 Month After Purchase",
        price: "₦10,500.00"
    },
    {
        name: "Respnsive Layout With HTML, CSS, JS",
        description: "Learn responsive layout with HTML, CSS, and JavaScript - create dynamic and interactive web pages that work on all devices.",
        image: ResponsiveDesignImage,
        certification: "Certification",
        ExpireDate: "6 Month After Purchase",
        price: "₦10,500.00"
    }
]


const BuyCoursePage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = coursesData.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="buyCourse-container">
            <Nav />

            <div className="search-input-section">
                <input 
                    type="text" 
                    placeholder="Search for courses..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search"></i>
            </div>
            
            <div className="buy-course">
                {filteredCourses.map((course, index) => (
                    <div key={index} className="course-card">
                        <div className="course-image">
                            <img src={course.image} alt={course.name} />
                            <i className="fas fa-bookmark bookmark-icon"></i>
                        </div>
                        <div className="course-content">
                            <h3>{course.name}</h3>
                            <p>{course.description}</p>
                            <div className="course-meta">
                                <span className="certification">{course.certification}</span>
                                <span className="expire-date">{course.ExpireDate}</span>
                            </div>
                            <div className="course-footer">
                                <span className="price">{course.price}</span>
                                <button className="buy-btn">Buy Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default BuyCoursePage;