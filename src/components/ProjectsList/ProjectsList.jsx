    import React from 'react';
    import { useProjectContext } from '../Context';
    import './ProjectsList.css';

    const ProjectsList = ({ onProjectClick }) => {
        const { projects } = useProjectContext();
        return (
            <div className="projects-list">
            {projects &&
                projects.map((project) => (
                <div
                    key={project.id}
                    className="project-item"
                    onClick={() => onProjectClick(project.id)}
                >
                    {project.projectName}
                </div>
                ))}
            </div>
        );
    };

    export default ProjectsList;
