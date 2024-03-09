import logo from "../icons/logo.png";
import { useNavigate } from 'react-router-dom';

const TaskDetails = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate(`/`);
    };

    return(
        <div className="topMenu"><img src={logo} className="logo" alt="Logo" onClick={handleLogoClick} /> </div>
    );

};

export default TaskDetails;