import React from 'react';
import Task from '../Task/Task';
import { useDrop } from 'react-dnd';
import './StatusColumn.css';

const StatusColumn = ({ status, tasks, onDrop }) => {
    const statusList = [
        { name: 'todo', value: 0 },
        { name: 'in progress', value: 1 },
        { name: 'in review', value: 2 },
        { name: 'done', value: 3 },
    ];

    const [, drop] = useDrop({
        accept: 'TASK',
        drop: (item) => {
            const newStatusValue = statusList.find(item => item.name === status).value;
            console.log(newStatusValue);
            onDrop(item.id, newStatusValue);
            updateTaskStatus(item.id, newStatusValue);
        },
    });

    const updateTaskStatus = async (taskId, newStatusValue) => {
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

    const addTask = () =>{
        
    }


    return (
        <div className={status.replace(/\s/g, '')} ref={drop}>
            <span className='taskStatus'>{status.toUpperCase()}:</span>
            <div className={`plus ${status.replace(/\s/g, '')}button`} onClick={addTask()}></div>
            {tasks
                .filter((task) => task.taskStatus === statusList.find(item => item.name === status).value)
                .map((task) => (
                    <Task key={task.id} task={task} />
                ))}
        </div>
    );
};

export default StatusColumn;
