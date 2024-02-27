import React from 'react';
import { useLocation } from 'react-router-dom';
import './TaskDetails.css'
import { useProjectContext } from '../Context';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as EditIcon } from "../../icons/edit.svg";

const TaskDetails = () => {
    const {statusList} = useProjectContext();
    const navigate = useNavigate();
    const location = useLocation();
    const task = location.state.task;

    const getStatusName = (statusValue) => {
        const statusObject = statusList.find(item => item.value === statusValue);
        return statusObject ? String(statusObject.name) : null;
    };

    const handleDetailsBack = () => {
        navigate(`/dashboard`);
    };

    return (
        <div className='taskDetails'>
            <button className='taskDetailsBack' onClick={handleDetailsBack}>Back</button>
                <div className='taskData'>
                    <strong>Task Name:</strong> {task.taskName}<br/>
                    <strong>Task Description:</strong> {task.taskDescription}<br/>
                    <strong>Task Status:</strong> {getStatusName(task.taskStatus)}<br/>
                    <strong>Users:</strong>
                    {task.users.map((user) => (
                        <div key={user.id}>{user.userName}</div>
                    ))}
                    <EditIcon style={{ fill: 'white' }} />
                </div>
        </div>
    );
};

export default TaskDetails;
