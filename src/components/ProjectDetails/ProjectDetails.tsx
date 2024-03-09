import { useState, useEffect } from 'react';
import StatusColumn from './StatusColumn';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useProjectContext } from '../Context';
import { useAuth } from '../../Auth';
import { useParams, useNavigate } from 'react-router-dom';
import AssignToProject from './AssignToProject';
import TopMenu from '../TopMenu';

interface User {
    id: number;
    userName: string;
}

interface IProjectDetails {
    projectName: string;
    tasks: Task[];
}

interface Task {
    id: number;
    taskStatus: number;
    taskDescription: string;
    creationDate: string;
    taskName?: string;
    users: User[];
}

const ProjectDetails = () => {
    const { refreshTasks } = useProjectContext();
    const [projectDetails, setProjectDetails] = useState<IProjectDetails | null>(null);
    const [showAssignUsersModal, setShowAssignUsersModal] = useState(false);
    const { token } = useAuth();
    const { id } = useParams();
    const projectId = parseInt(id || '', 10);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {   
            navigate('/');
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchProjectDetails = async () => {
        try {
            const response = await fetch(`https://localhost:7091/api/project/project/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
            throw new Error('Failed to fetch project details');
            }
            const data = await response.json();
            setProjectDetails(data);
        } catch (error:any) {
            navigate('/dashboard');
            console.log(error.message);
        }
        };
        fetchProjectDetails();
    }, [projectId, refreshTasks, token, navigate]);

    const handleDrop = (taskId: number, status: number) => {
        if (projectDetails) {
        const updatedProjectDetails: IProjectDetails = {
            ...projectDetails,
            tasks: projectDetails.tasks.map((task) =>
            task.id === taskId ? { ...task, taskStatus: status } : task
            ),
        };

        setProjectDetails(updatedProjectDetails);
        }
    };

    const navigateDashboard = () => {
        navigate('/');
    };

    const assignUsers = () => {
        setShowAssignUsersModal(true);
    };

    return (
        <div className='projectDetails'>
            <TopMenu />
            <div className="leftMenu">
                <button className="leftMenuButton" type="button" onClick={navigateDashboard}>Projects</button>
                <button className="leftMenuButton" type="button" onClick={assignUsers}>Users</button>
            </div>
            <DndProvider backend={HTML5Backend}>
            <div className="projectDetailsMain">
                {projectDetails && (
                <div>
                    <h2 className="projectName">{projectDetails.projectName} details</h2>
                    <div className="projectColumns">
                        <StatusColumn status="todo" tasks={projectDetails.tasks} onDrop={handleDrop} />
                        <StatusColumn status="in progress" tasks={projectDetails.tasks} onDrop={handleDrop} />
                        <StatusColumn status="in review" tasks={projectDetails.tasks} onDrop={handleDrop} />
                        <StatusColumn status="done" tasks={projectDetails.tasks} onDrop={handleDrop} />
                    </div>
                </div>
                )}
            </div>
            </DndProvider>
            {showAssignUsersModal && <AssignToProject closeModal={setShowAssignUsersModal}/>}
        </div>
    );
};

export default ProjectDetails;

