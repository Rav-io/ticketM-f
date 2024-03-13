import { useState, useEffect } from 'react';
import ProjectDetails from '../ProjectDetails/ProjectDetails';
import ProjectsList from './ProjectsList';
import { useAuth } from '../../Auth';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../Context';
import CreateProject from './CreateProject';
import CreateUser from './CreateUser';
import TopMenu from '../TopMenu';

const Dashboard = () => {
    const { 
        setProjects, 
        selectedProject, 
        setSelectedProject,
        newProjectAdded, 
        setNewProjectAdded,
        currentUserRole, } = useProjectContext();
    const [showProjectsList, setShowProjectsList] = useState(true);
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {   
            navigate('/');
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:7091/api/project', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch project data');
                }
                const data = await response.json();
                setProjects(data);
            } catch (error:any) {
                console.log(error.message);
            }
        };
        fetchData();
        setNewProjectAdded(false);
    }, [newProjectAdded, setNewProjectAdded, setProjects, token]);

    const navigateDashboard = () => {
        setShowProjectsList(true);
    };

    const addProject = () => {
        setShowCreateProjectModal(true);
    };

    const handleProjectClick = (projectId: number) => {
        setSelectedProject(projectId);
        setShowProjectsList(false);
        navigate(`/project/${projectId}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const adduser = () => {
        setShowCreateUserModal(true);
    };

    return (
        <div className="dashboard">
            <TopMenu />
            <div className="leftMenu">
            <button className="leftMenuButton" type="button" onClick={handleLogout}>Logout</button>
                <button className="leftMenuButton" type="button" onClick={navigateDashboard}>Projects</button>
                {showProjectsList &&
                    <div>
                        {currentUserRole === "Admin" && <button className="leftMenuButton" type="button" onClick={addProject}>Add Project</button>}
                        {currentUserRole === "Admin" && <button className="leftMenuButton" type="button" onClick={adduser}>Add User</button>}
                    </div>
                }
            </div>
            <div className="main">
                {showProjectsList && <ProjectsList onProjectClick={handleProjectClick} />}
                {!showProjectsList && selectedProject && <ProjectDetails />}
            </div>
            {showCreateProjectModal && <CreateProject openModal={setShowCreateProjectModal}/>}
            {showCreateUserModal && <CreateUser openModal={setShowCreateUserModal}/>}
        </div>
    );
};

export default Dashboard;
