import React, { useState } from 'react';
import './CreateProject.css';
import { useProjectContext } from '../Context';


const CreateProject= ( ) => {
    const { setShowCreateProjectModal, setNewProjectAdded } = useProjectContext();
    const [newProjectName, setNewProjectName] = useState('');
    const [errorText, setErrorText] = useState('');

    const handleModalClose = () => {
        setShowCreateProjectModal(false);
        setNewProjectName('');
      };
    
    const handleModalSubmit = () => {
        if (!newProjectName.trim()) {
            setErrorText('Project name field is requierd!');
            return;
        }
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
                    setShowCreateProjectModal(false);
                    setNewProjectName('');
                    setNewProjectAdded(true);
                }
            })
            .catch((error) => {
              console.error('Error creating new project:', error);
        });
    };

    return (
        <div className="modal">
          <div className="modal-content">
              <h2 className="addProjectTitle">Add Project</h2>
              <input
                className="addProjectInput"
                type="text"
                placeholder="Enter Project Name"
                maxLength='25'
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              {errorText && <span style={{ color: 'red' }}>{errorText}</span>}<br /><br />
            <button className="addProjectButton" onClick={handleModalSubmit}>Submit</button>
            <button className="addProjectButton" onClick={handleModalClose}>Close</button>
          </div>
        </div>
    );
};

export default CreateProject;
