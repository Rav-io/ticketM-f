import React, { useEffect, useState, useRef } from 'react';
import { useProjectContext } from '../Context';
import { useAuth } from '../../Auth';

interface User {
    id: number;
    userName: string;
}

const CreateTask = () => {
    const { selectedProject, setShowCreateTaskModal, statusId, setRefreshTasks, currentUser } = useProjectContext();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [taskName, setTaskName] = useState<string>('');
    const [taskDescription, setTaskDescription] = useState<string>('');
    const [errorText, setErrorText] = useState<string>('');
    const { token } = useAuth();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://localhost:7091/api/user/getusers', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
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
    }, [token]);

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUserIds = Array.from(e.target.selectedOptions, (option) => Number(option.value));
        setSelectedUsers(selectedUserIds);
    };

    useEffect(() => {
        const modalNode = modalRef.current;
        const handleClickOutside = (event: MouseEvent) => {
            if (modalNode && !modalNode.contains(event.target as Node)) {
                setShowCreateTaskModal(false);
            }
        };
        const handleInsideModalClick = (event: MouseEvent) => {
            event.stopPropagation();
        };
        document.addEventListener('mousedown', handleClickOutside);
        modalNode?.addEventListener('mousedown', handleInsideModalClick);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            modalNode?.removeEventListener('mousedown', handleInsideModalClick);
        };
    }, [setShowCreateTaskModal, modalRef]);

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
            createdBy: currentUser,
        };

        try {
            const response = await fetch('https://localhost:7091/api/task/addtask', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                setRefreshTasks((prevRefreshTasks) => !prevRefreshTasks);
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
        <div className="modalTask">
            <div className='createTaskModal' ref={modalRef} >
                <div className='createIssue'>
                    <span><b>Create new issue </b></span><br />
                </div>
                <hr style={{ borderColor: '#64748b' }}></hr>
                <form>
                    <span><b>Task Name: </b></span><br />
                    <input
                        type='text'
                        className='inputTaskName'
                        placeholder="Enter Task Name"
                        maxLength={30}
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}>
                    </input><br />
                    <span><b>Task Description: </b></span><br />
                    <textarea
                        className='inputTaskDescription'
                        placeholder="Enter Task Description"
                        maxLength={250}
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}>
                    </textarea><br />
                    <span><b>Select Users: </b></span><br />
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
        </div>
    );
};

export default CreateTask;
