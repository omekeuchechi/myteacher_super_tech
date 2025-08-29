import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/Authcontext";
import '../../assets/styles/dashboard/header.css';

import defaultAvatar from '../../assets/illustrations/default_avatar.png';

const Header = ({theme}) => {
    const {user, logout} = useContext(AuthContext);
    return(
      <div className={`Dashboard-up-header ${theme}`}>
        <div className="Dashboard-up-header-right">
          {user.avatar ? <><img src={user.avatar} alt="" /></> : <><img src={defaultAvatar} alt="default avatar"/> </>}
        </div>
      </div>  
    );
};

export default Header;
