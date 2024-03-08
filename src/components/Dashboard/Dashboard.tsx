import { useState, useEffect } from 'react';
import './Dashboard.css';
import ProjectDetails from '../ProjectDetails/ProjectDetails';
import ProjectsList from '../ProjectsList/ProjectsList';
import { useAuth } from '../../Auth';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../Context';
import CreateProject from '../CreateProject/CreateProject';
import TopMenu from '../TopMenu/TopMenu';

const Dashboard = () => {
    const { 
        setProjects, 
        selectedProject, 
        setSelectedProject,
        newProjectAdded, 
        setNewProjectAdded, } = useProjectContext();
    const [showProjectsList, setShowProjectsList] = useState(true);
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const { token } = useAuth();
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

    return (
        <div className="dashboard">
            <TopMenu />
            <div className="leftMenu">
                <button className="leftMenuButton" type="button" onClick={navigateDashboard}>Projects</button>
                {showProjectsList &&
                    <button className="leftMenuButton" type="button" onClick={addProject}>Add Project</button>
                }
            </div>
            <div className="main">
                {showProjectsList && <ProjectsList onProjectClick={handleProjectClick} />}
                {!showProjectsList && selectedProject && <ProjectDetails />}
            </div>
            {showCreateProjectModal && <CreateProject closeModal={setShowCreateProjectModal}/>}
        </div>
    );
};

export default Dashboard;
