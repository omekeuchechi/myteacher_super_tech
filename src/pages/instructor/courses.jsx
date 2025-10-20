import { useEffect, useState } from 'react';
import './courses.css';
import SideNav from '../../components/instructorCom/sideNav';
import MainFrame from '../../components/instructorCom/mainFrame';
import Card from '../../components/instructorCom/card';
import { Link } from 'react-router-dom';

const InstructorCourses = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    return (
        <div className="instructor-course-container">
            <SideNav
                isMobileMenuOpen={isMobileMenuOpen}
                onMenuToggle={setIsMobileMenuOpen}
            />
            <MainFrame isMobileMenuOpen={isMobileMenuOpen} className='courses-quick-action'>
            <Link to='/instructor/mycourses'>
                <Card
                    className="card fadeIn v-course"
                    hoverBgColor='rgba(0, 0, 0, 0.69)'
                    hoverEffect="elevate"
                    animationType="fadeIn"
                    delay={100}
                >
                    <i className="fas fa-chalkboard-teacher"></i>
                    <h1>View Course</h1>
                </Card>
            </Link>

            <Link to='/instructor/createcourse'>
                <Card
                    className="card fadeIn c-course"
                    hoverBgColor='rgba(100, 97, 97, 0.52)'
                    hoverEffect="elevate"
                    animationType="fadeIn"
                    delay={100}
                >
                    <i className='fas fa-plus'></i>
                    <h1>Create Course</h1>
                </Card>
            </Link>

            <Link to='/instructor/lecture-room'>
                <Card
                    className="card fadeIn a-Lecture"
                    hoverBgColor='rgba(255, 255, 255, 0.1)'
                    hoverEffect="elevate"
                    animationType="fadeIn"
                    delay={100}
                >
                    <i className='fas fa-play'></i>
                    <h1>Attend Lecture</h1>
                </Card>
            </Link>
            </MainFrame>
        </div>
    );
};

export default InstructorCourses;
