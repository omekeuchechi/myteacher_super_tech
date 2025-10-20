import { useContext } from "react";
import { AuthContext } from "../../../context/Authcontext";

const MyCourses = () => {
    const { user } = useContext(AuthContext);
    return (
        <div>
            <h1>My Courses</h1>
        </div>
    );
};

export default MyCourses;