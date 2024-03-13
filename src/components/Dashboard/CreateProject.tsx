import { useState } from 'react';
import { useProjectContext } from '../Context';
import { useAuth } from '../../Auth';

interface CreateProjectProps {
  openModal: (value: boolean) => void;
}

const CreateProject = ({openModal}:CreateProjectProps) => {
    const { setNewProjectAdded } = useProjectContext();
    const [newProjectName, setNewProjectName] = useState<string>('');
    const [errorText, setErrorText] = useState<string>('');
    const { token } = useAuth();

    const handleModalClose = () => {
        openModal(false);
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
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => {
                if (response.ok) {
                    openModal(false);
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
                maxLength={25}
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
