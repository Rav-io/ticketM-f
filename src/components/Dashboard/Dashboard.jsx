import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import ProjectDetails from '../ProjectDetails/ProjectDetails';
import ProjectsList from '../ProjectsList/ProjectsList';
import { useAuth } from '../../Auth';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../Context';
import CreateProject from '../CreateProject/CreateProject';
import logo from "../../icons/logo.png";

const Dashboard = () => {
    const { 
        setProjects, 
        selectedProject, 
        setSelectedProject, 
        showCreateProjectModal, 
        setShowCreateProjectModal, 
        newProjectAdded, 
        setNewProjectAdded, } = useProjectContext();
    const [showProjectsList, setShowProjectsList] = useState(true);
    const [showUsersButton, setShowUsersButton] = useState(false);
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
            const response = await fetch('https://localhost:7091/api/project');
            if (!response.ok) {
            throw new Error('Failed to fetch project data');
            }
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.log(error.message);
        }
        };
        fetchData();
        setNewProjectAdded(false);
    }, [newProjectAdded]);

    const navigateDashboard = () => {
        setShowProjectsList(true);
        setShowUsersButton(false);
    };

    const addProject = () => {
        setShowCreateProjectModal(true);
    };

    const handleProjectClick = (projectId) => {
        setSelectedProject(projectId);
        setShowProjectsList(false);
        setShowUsersButton(true);
    };

    return (
        <div className="dashboard">
        <div className="topMenu"><img src={logo} className="logo" alt="Logo" /> </div>
        <div className="leftMenu">
            <button className="leftMenuButton" type="button" onClick={navigateDashboard}>Projects</button>
            {showProjectsList &&
                <button className="leftMenuButton" type="button" onClick={addProject}>Add Project</button>
            }
            {showUsersButton &&
                <button className="leftMenuButton" type="button">Users</button>
            }
        </div>
        <div className="main">
            {showProjectsList && <ProjectsList onProjectClick={handleProjectClick} />}
            {!showProjectsList && selectedProject && <ProjectDetails projectId={selectedProject} />}
        </div>
        {showCreateProjectModal && <CreateProject/>}
        </div>
    );
    };

export default Dashboard;
