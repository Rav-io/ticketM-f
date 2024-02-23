import React from 'react';

const ProjectsList = ({ projects, onProjectClick }) => {
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
