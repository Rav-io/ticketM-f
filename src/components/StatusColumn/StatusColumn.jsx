import React from 'react';
import Task from '../Task/Task';
import { useDrop } from 'react-dnd';
import './StatusColumn.css';
import CreateTask from '../CreateTask/CreateTask';
import { useProjectContext } from '../Context';

const StatusColumn = ({ status, tasks, onDrop }) => {
    const {showCreateTaskModal, setShowCreateTaskModal, setStatusId, statusList} = useProjectContext();

    const [, drop] = useDrop({
        accept: 'TASK',
        drop: (item) => {
            const newStatusValue = statusList.find(item => item.name === status).value;
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

    const addTask = (status) =>{
        setShowCreateTaskModal(true);
        setStatusId(status);
    }


    return (
        <div className={status.replace(/\s/g, '')} ref={drop}>
            <span className='taskStatus'>{status.toUpperCase()}:</span>
            {tasks
                .filter((task) => task.taskStatus === statusList.find(item => item.name === status).value)
                .map((task) => (
                    <Task key={task.id} task={task} />
                ))}
            {showCreateTaskModal && <CreateTask/>}
            <div className={`plus ${status.replace(/\s/g, '')}button`} onClick={() => addTask(statusList.find(item => item.name === status).value)}></div>
        </div>
    );
};

export default StatusColumn;
