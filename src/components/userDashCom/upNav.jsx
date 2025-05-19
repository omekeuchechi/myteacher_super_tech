import {useEffect} from 'react';
import { Link } from "react-router-dom";
import NavLogo from '../../img/Untitled-1.png';
import '../../assets/styles/dashboard/upNav.css';
import defualtAvatar from '../../assets/illustrations/blue-circle.png';

const UpNav = () => {
    return(
        <div className="up-nav">
            <div className="company-caption">
                <Link to="/">
                    <img src={NavLogo} className="myteacher-logo" alt />
                </Link>
                <Link to="/">
                Myteacher Intitute
                </Link>
            </div>

            <div className="search">
                <input type="search" placeholder="search..." />
                {/* <i className="fa-solid fa-magnifying-glass" style={{position: 'sticky', top: '4%', left: '435px', color: 'gray', zIndex: 400, fontSize: '2rem'}}></i> */}
            </div>

            <div className="notification">
                <i className="fas fa-bell"></i>
            </div>

            <div className="profile-image">
                <img src={defualtAvatar} alt="" />
            </div>
        </div>
    );
}

export default UpNav;