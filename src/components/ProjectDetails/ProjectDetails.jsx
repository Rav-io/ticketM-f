import React, { useState, useEffect } from 'react';
import './ProjectDetails.css'
import StatusColumn from '../StatusColumn/StatusColumn';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ProjectDetails = ({ projectId }) => {
    const [projectDetails, setProjectDetails] = useState(null);
  
    useEffect(() => {
      const fetchProjectDetails = async () => {
        try {
          const response = await fetch(`https://localhost:7091/api/project/project/${projectId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch project details');
          }
          const data = await response.json();
          setProjectDetails(data);
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchProjectDetails();
    }, [projectId]);
  
    const handleDrop = (taskId, status) => {
        const updatedProjectDetails = {
          ...projectDetails,
          tasks: projectDetails.tasks.map((task) =>
            task.id === taskId ? { ...task, taskStatus: status } : task
          ),
        };
    
        setProjectDetails(updatedProjectDetails);
    };
  
    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                {projectDetails && (
                    <div>
                        <h2 className='projectName'>{projectDetails.projectName} Details</h2>
                        <div className='projectDetails'>
                            <StatusColumn status='todo' tasks={projectDetails.tasks} onDrop={handleDrop} />
                            <StatusColumn status='in progress' tasks={projectDetails.tasks} onDrop={handleDrop} />
                            <StatusColumn status='in review' tasks={projectDetails.tasks} onDrop={handleDrop} />
                            <StatusColumn status='done' tasks={projectDetails.tasks} onDrop={handleDrop} />
                        </div>
                    </div>
                )}
            </div>
        </DndProvider>
    );
  };
  
  export default ProjectDetails;