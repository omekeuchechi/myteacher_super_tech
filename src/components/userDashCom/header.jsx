import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/Authcontext";
import '../../assets/styles/dashboard/header.css';

const Header = ({theme}) => {
    const {user, logout} = useContext(AuthContext);
    return(
      <div className={`Dashboard-up-header ${theme}`}>
        <div className="Dashboard-up-header-right">
          <img src={user.avatar} alt="Myteacher student profile image" />
        </div>
      </div>  
    );
};

export default Header;
