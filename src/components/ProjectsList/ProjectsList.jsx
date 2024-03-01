    import React from 'react';
    import { useProjectContext } from '../Context';
    import './ProjectsList.css';
    import user from "../../icons/profile.png";

    const ProjectsList = ({ onProjectClick }) => {
        const { projects } = useProjectContext();

        return (
            <div className="projects-list">
            {projects &&
                projects.map((project) => (
                <div
                    key={project.projectId}
                    className="project-item"
                    onClick={() => onProjectClick(project.projectId)}
                >
                    {project.projectName}<br />
                    <div className="user-images">
                    {project.userIds.slice(0, 9).map((userId, index) => {
                        const key = `${index}${userId}${project.projectId}`;
                        return (
                            <img
                                key={key}
                                src={user}
                                alt={`User ${userId}`}
                                className="user-image"
                            />
                        );
                    })}
                    </div>
                </div>
                ))
                }
            </div>
        );
    };

    export default ProjectsList;
