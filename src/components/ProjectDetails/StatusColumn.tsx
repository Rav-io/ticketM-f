import Task from './Task';
import { useDrop } from 'react-dnd';
import { useProjectContext } from '../Context';
import { useAuth } from '../../Auth';

interface User {
    id: number;
    userName: string;
}
interface StatusColumnProps {
    status: string;
    tasks: SingleTask[];
    onDrop: (taskId: number, newStatusValue: number) => void;
}

interface SingleTask {
    id: number;
    taskStatus: number;
    taskDescription: string;
    creationDate: string;
    taskName?: string;
    users: User[];
}

const StatusColumn = ({ status, tasks, onDrop }:StatusColumnProps) => {
    const { setShowCreateTaskModal, setStatusId, statusList} = useProjectContext();
    const { token } = useAuth();
    const [, drop] = useDrop({
        accept: 'TASK',
        drop: (item: { id: number }) => {
            const newStatusValue = statusList.find((item) => item.name === status)?.value;
            if (newStatusValue !== undefined) {
                onDrop(item.id, newStatusValue);
                updateTaskStatus(item.id, newStatusValue);
            }
        },
    });

    const updateTaskStatus = async (taskId:number, newStatusValue:number) => {
        const apiEndpoint = `https://localhost:7091/api/task/updatetaskstatus/${taskId}`;
        try {
            const response = await fetch(apiEndpoint, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskStatus: newStatusValue,
                }),
            });

            if (!response.ok) {
                console.error('Failed to update task status');
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const addTask = (status:number | undefined) => {
        setShowCreateTaskModal(true);
        setStatusId(status === undefined ? null : status);
    }
    return (
        <div className={status.replace(/\s/g, '')} ref={drop}>
            <span className='taskStatus'>{status.toUpperCase()}:</span>
            {tasks
                .filter((task) => task.taskStatus === statusList.find(item => item.name === status)?.value)
                .map((task) => (
                    <Task key={task.id} task={task} />
            ))}
            <div className={`plus ${status.replace(/\s/g, '')}button`} onClick={() => addTask(statusList.find(item => item.name === status)?.value)}></div>
        </div>
    );
};

export default StatusColumn;
