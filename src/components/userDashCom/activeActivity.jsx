import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../assets/styles/dashboard/activity.css';

// course section image importation
import mernStack from '../../img/myteacher_mern_stack.png';
import pythonStack from '../../img/myteacher_python.png';
import figmaStack from '../../img/myteacher_figma.png';
import dataStack from '../../img/myteacher_data_science.png';
import myteacherRectStack from '../../img/myteacher_react.png';
import myteacherSecurityStack from '../../img/myteacher_security.png';
import myteacherMechineStack from '../../img/myteacher_learning.png';
import myteacherBitcoinStack from '../../img/myteacher_bitcoin.png';
import myteacherJavascriptStack from '../../img/myteacher_java.png';
import myteacherCloudStack from '../../img/myteacher_server.png';



const courses = [
  { id: 1, title: 'MERN STACK', time: '10am to 1pm', color: 'green', image: mernStack },
  { id: 2, title: 'Python Basics', time: '10am to 1pm', color: '#FF5733', image: pythonStack },
  { id: 3, title: 'UI and UX with Figma Design', time: '3pm to 5pm', color: 'orange', image: figmaStack },
  { id: 4, title: 'Data Science with Python', time: '10am to 1pm', color: '#3399FF', image: dataStack },
  { id: 5, title: 'React Native Mobile App', time: '10am to 1pm', color: '#00BFFF', image: myteacherRectStack },
  { id: 6, title: 'Cybersecurity Essentials', time: '1pm to 4pm', color: '#800080', image: myteacherSecurityStack },
  { id: 7, title: 'Machine Learning', time: '10am to 1pm', color: '#FF69B4', image: myteacherMechineStack },
  { id: 8, title: 'Blockchain Basics', time: '9am to 11am', color: '#8A2BE2', image: myteacherBitcoinStack },
  { id: 9, title: 'JavaScript Fundamentals', time: '12pm to 1pm', color: '#FFD700', image: myteacherJavascriptStack },
  { id: 10, title: 'Cloud Computing', time: '1pm to 6pm', color: '#4682B4', image: myteacherCloudStack },
];

// Helper to convert 12hr time string to 24hr number
const parseStartHour = (time) => {
  const match = time.match(/^(\d+)(am|pm)/i);
  if (!match) return 0;
  let [, hourStr, period] = match;
  let hour = parseInt(hourStr);
  if (period.toLowerCase() === 'pm' && hour !== 12) hour += 12;
  if (period.toLowerCase() === 'am' && hour === 12) hour = 0;
  return hour;
};

const ActiveActivity = () => {
  const [viewAll, setViewAll] = useState(false);

  const sortedCourses = [...courses].sort(
    (a, b) => parseStartHour(a.time) - parseStartHour(b.time)
  );

  const displayedCourses = viewAll ? sortedCourses : sortedCourses.slice(0, 3);

  return (
    <div className="active-activity-section">
      <div className="upcoming-class-section">
        <div className="upcoming-class-header">
          <h2 className="upcoming-class-header-txt">Upcoming Classes</h2>
          <button className="view-all-btn" onClick={() => setViewAll(!viewAll)}>
            {viewAll ? 'View Less' : 'View All'}
          </button>
        </div>

        <div className="activities-section">
          {displayedCourses.map((course) => (
            <div
              className="activity"
              key={course.id}
              style={{ borderLeft: `5px solid ${course.color}` }}
            >
              <div className="activity-content">
                <h3>{course.title}</h3>
                <p>{course.time}</p>
              </div>
              <i className="fas fa-chevron-right activity-icon"></i>
            </div>
          ))}
        </div>
      </div>

      <div className="course-illustrated-section">
        {courses.map((course) => (
          <div className="illustrated-box" key={course.id} style={{background: `${course.color}`, color: '#fff'}}>
            <h2>{course.title}</h2>
            <img src={course.image} alt="myteacher course image" />
          </div>
        ))}
      </div>

      <div className="resent-notification">
        <div className="notification-box">
          <span className="time">10:20</span> System maintenance will begin at noon.
        </div>
        <div className="notification-box">
          <span className="time">10:45</span> New class materials have been uploaded.
        </div>
      </div>

    </div>
  );
};

export default ActiveActivity;
