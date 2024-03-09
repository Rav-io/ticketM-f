import { useDrag } from 'react-dnd';
import TaskDetails from './TaskDetails';
import { useState } from 'react';

interface User {
    id: number;
    userName: string;
}

interface TaskProps {
    task: {
        id: number;
        taskStatus: number;
        taskDescription: string;
        creationDate: string;
        taskName?: string;
        users: User[];
    };
}

const Task = ({ task }:TaskProps) => {
    const [showCreateTaskModal, setShowTaskDetailsModal] = useState(false);

    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { id: task.id, status: task.taskStatus },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const handleTaskClick = () => {
        setShowTaskDetailsModal(true);
    };

    return (
        <div>
            <div className={`singleTask ${isDragging ? 'dragging' : ''}`} ref={drag}>
                <strong>Task #{task.id}</strong>
                <strong>Task Name:</strong> {task.taskName}
                <button className="showDetailsButton" onClick={handleTaskClick}>
                    Details
                </button>
            </div>
            {showCreateTaskModal && <TaskDetails currentTask={task} showModal={setShowTaskDetailsModal}/>}
        </div>
    );
};

export default Task;
