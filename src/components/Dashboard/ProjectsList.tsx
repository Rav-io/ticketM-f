import { useProjectContext } from '../Context';
import user from "../../icons/profile.png";

interface ProjectsListProps {
    onProjectClick: (projectId: number) => void;
}

const ProjectsList = ({ onProjectClick }:ProjectsListProps) => {
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
