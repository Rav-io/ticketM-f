import React, {useState} from 'react';
import { useDrag } from 'react-dnd';
import './Task.css'
import { useNavigate } from 'react-router-dom';

const Task = ({ task }) => {
    const navigate = useNavigate();

    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { id: task.id, status: task.taskStatus },
        collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
        }),
    });
    
    const handleTaskClick = () => {
        navigate(`/task/${task.id}`, { state: { task } });
    };

    return (
        <div className='singleTask' ref={drag}>
            <strong>Task #{task.id}</strong>
            <strong>Task Name:</strong> {task.taskName}
            <button className="showDetailsButton" onClick={handleTaskClick}>Details</button>
        </div>
    );
};

export default Task;