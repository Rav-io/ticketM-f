import React, { useEffect, useState, useRef } from 'react';
import './CreateTask.css';
import { useProjectContext } from '../Context';

interface User {
    id: number;
    userName: string;
}

const CreateTask = () => {
    const { selectedProject, setShowCreateTaskModal, statusId, setRefreshTasks } = useProjectContext();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [taskName, setTaskName] = useState<string>('');
    const [taskDescription, setTaskDescription] = useState<string>('');
    const [errorText, setErrorText] = useState<string>('');

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://localhost:7091/api/user/getusers');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data: User[] = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUserIds = Array.from(e.target.selectedOptions, (option) => Number(option.value));
        setSelectedUsers(selectedUserIds);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowCreateTaskModal(false);
            }
        };

        const handleInsideModalClick = (event: MouseEvent) => {
            event.stopPropagation();
        };

        document.addEventListener('mousedown', handleClickOutside);
        modalRef.current?.addEventListener('mousedown', handleInsideModalClick);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            modalRef.current?.removeEventListener('mousedown', handleInsideModalClick);
        };
    }, [setShowCreateTaskModal]);

    const handleSubmit = async () => {
        if (!taskName.trim() || !taskDescription.trim()) {
            setErrorText('Task name and description fields are required!');
            return;
        }

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

    const handleCloseAddTaskModal = () => {
        setShowCreateTaskModal(false);
    };

    return (
        <div className='createTaskModal' ref={modalRef} >
            <div className='createIssue'>
                <span>Create new issue in <b>{selectedProject}</b></span><br />
            </div>
            <hr style={{ borderColor: 'gray' }}></hr>
            <form>
                <span>Task Name: </span><br />
                <input
                    type='text'
                    className='inputTaskName'
                    placeholder="Enter Task Name"
                    maxLength={30}
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}>
                </input><br />
                <span>Task Description: </span><br />
                <input
                    type='text'
                    className='inputTaskDescription'
                    placeholder="Enter Task Description"
                    maxLength={100}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}>
                </input><br />
                <span>Select Users: </span><br />
                <select className="userSelect" multiple value={selectedUsers.map(String)} onChange={handleUserChange}>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.userName}</option>
                    ))}
                </select><br />
                {errorText && <span style={{ color: 'red' }}>{errorText}</span>}
                <br />
                <button className='addTaskButton' type="button" onClick={handleSubmit}>Add Task</button>
                <button className='addTaskButton' type="button" onClick={handleCloseAddTaskModal}>Close</button>
            </form>
        </div>
    );
};

export default CreateTask;
