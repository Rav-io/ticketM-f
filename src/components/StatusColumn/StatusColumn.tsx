import Task from '../Task/Task';
import { useDrop } from 'react-dnd';
import './StatusColumn.css';
import CreateTask from '../CreateTask/CreateTask';
import { useProjectContext } from '../Context';

interface StatusColumnProps {
    status: string;
    tasks: Task[];
    onDrop: (taskId: number, newStatusValue: number) => void;
}

interface Task {
    id: number;
    taskStatus: number;
}

const StatusColumn = ({ status, tasks, onDrop }:StatusColumnProps) => {
    const {showCreateTaskModal, setShowCreateTaskModal, setStatusId, statusList} = useProjectContext();

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
        setStatusId(status || null);
    }
    return (
        <div className={status.replace(/\s/g, '')} ref={drop}>
            <span className='taskStatus'>{status.toUpperCase()}:</span>
            {tasks
                .filter((task) => task.taskStatus === statusList.find(item => item.name === status)?.value)
                .map((task) => (
                    <Task key={task.id} task={task} />
                ))}
            {showCreateTaskModal && <CreateTask/>}
            <div className={`plus ${status.replace(/\s/g, '')}button`} onClick={() => addTask(statusList.find(item => item.name === status)?.value)}></div>
        </div>
    );
};

export default StatusColumn;
