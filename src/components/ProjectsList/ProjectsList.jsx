import React from 'react';
import { useProjectContext } from '../Context';
import './ProjectsList.css';

const ProjectsList = ({ onProjectClick }) => {
  const { projects } = useProjectContext();
  return (
    <div>
      {projects && projects.map((project) => (
        <div key={project.id} onClick={() => onProjectClick(project.id)}>
          <div className="projectItem" style={{ cursor: 'pointer' }}>
            {project.projectName}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;
