import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import ProjectDetails from '../ProjectDetails/ProjectDetails';
import ProjectsList from '../ProjectsList/ProjectsList';
import { useAuth } from '../../Auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectAdded, setnewProjectAdded] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectsList, setShowProjectsList] = useState(true);
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
    setnewProjectAdded(false);
  }, [newProjectAdded]);

  const navigateDashboard = () => {
    setShowProjectsList(true);
  };

  const addProject = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewProjectName('');
  };

  const handleModalSubmit = () => {
      const requestData = {
        ProjectName: newProjectName
      };
  
      fetch("https://localhost:7091/api/project/create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => {
          if (response.ok) {
            setIsModalOpen(false);
            setNewProjectName('');
            setnewProjectAdded(true);
          }
        })
        .catch((error) => {
          console.error('Error creating new project:', error);
        });
  };

  const handleProjectClick = (projectId) => {
    setSelectedProject(projectId);
    setShowProjectsList(false);
  };

  return (
    <div className="dashboard">
      <div className="topMenu">Task Manager</div>
      <div className="leftMenu">
        <button className="leftMenuButton" type="button" onClick={navigateDashboard}>Projects</button>
        {showProjectsList &&
            <button className="leftMenuButton" type="button" onClick={addProject}>Add Project</button>
        }
      </div>
      <div className="main">
        {showProjectsList && <ProjectsList projects={projects} onProjectClick={handleProjectClick} />}
        {!showProjectsList && selectedProject && <ProjectDetails projectId={selectedProject} />}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
              <h2 className="addProjectTitle">Add Project</h2>
              <input
                className="addProjectInput"
                type="text"
                placeholder="Enter Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            <button className="addProjectButton" onClick={handleModalSubmit}>Submit</button>
            <button className="addProjectButton" onClick={handleModalClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
