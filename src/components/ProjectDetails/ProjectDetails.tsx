import React, { useState, useEffect } from 'react';
import './ProjectDetails.css';
import StatusColumn from '../StatusColumn/StatusColumn';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useProjectContext } from '../Context';

interface ProjectDetailsProps {
    projectId: number;
}
interface ProjectDetails {
    projectName: string;
    tasks: Task[];
}

interface Task {
    id: number;
    taskStatus: number;
}

const ProjectDetails = ({ projectId }:ProjectDetailsProps) => {
    const { refreshTasks } = useProjectContext();
    const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
        try {
            const response = await fetch(`https://localhost:7091/api/project/project/${projectId}`);
            if (!response.ok) {
            throw new Error('Failed to fetch project details');
            }
            const data = await response.json();
            setProjectDetails(data);
        } catch (error:any) {
            console.log(error.message);
        }
        };
        fetchProjectDetails();
    }, [projectId, refreshTasks]);

    const handleDrop = (taskId: number, status: number) => {
        if (projectDetails) {
        const updatedProjectDetails: ProjectDetails = {
            ...projectDetails,
            tasks: projectDetails.tasks.map((task) =>
            task.id === taskId ? { ...task, taskStatus: status } : task
            ),
        };

        setProjectDetails(updatedProjectDetails);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
        <div className="projectDetailsMain">
            {projectDetails && (
            <div>
                <h2 className="projectName">{projectDetails.projectName} details</h2>
                <div className="projectDetails">
                <StatusColumn status="todo" tasks={projectDetails.tasks} onDrop={handleDrop} />
                <StatusColumn status="in progress" tasks={projectDetails.tasks} onDrop={handleDrop} />
                <StatusColumn status="in review" tasks={projectDetails.tasks} onDrop={handleDrop} />
                <StatusColumn status="done" tasks={projectDetails.tasks} onDrop={handleDrop} />
                </div>
            </div>
            )}
        </div>
        </DndProvider>
    );
};

export default ProjectDetails;

