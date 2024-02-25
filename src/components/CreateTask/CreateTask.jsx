import React, { useEffect, useState } from 'react';
import './CreateTask.css';
import { useProjectContext } from '../Context';

const CreateTask = ( ) => {
    const { selectedProject, setShowCreateTaskModal, statusId, setRefreshTasks } = useProjectContext();
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await fetch('https://localhost:7091/api/user/getusers');
            if (!response.ok) {
            throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        };

        fetchUsers();
    }, []);

    const handleUserChange = (e) => {
        const selectedUserIds = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedUsers(selectedUserIds);
    };

    const handleSubmit = async () => {
        setShowCreateTaskModal(false);
    const requestData = {
        taskName: taskName,
        taskDescription: taskDescription,
        taskStatus: statusId,
        projectId: selectedProject,
        userIds: selectedUsers,
    };

    try {
        const response = await fetch('https://localhost:7091/api/task/addtask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        body: JSON.stringify(requestData),
      });

        if (response.ok) {
            setRefreshTasks(true);
        } else {
            console.error('Failed to add task');
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
    };

    return (
        <div className='createTaskModal'>
            <form>
                <span>Task Name: </span><br />
                <input type='text' className='inputTaskName' maxLength='30' value={taskName} onChange={(e) => setTaskName(e.target.value)}></input><br />
                <span>Task Description: </span><br />
                <input type='text' className='inputTaskDescription' maxLength='100' value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)}></input><br />
                <span>Select Users: </span><br />
                <select className="userSelect" multiple value={selectedUsers} onChange={handleUserChange}>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.userName}</option>
                ))}
                </select><br />
                <button className='addTask' type="button" onClick={handleSubmit}>Add Task</button>
            </form>
        </div>
    );
};

export default CreateTask;
