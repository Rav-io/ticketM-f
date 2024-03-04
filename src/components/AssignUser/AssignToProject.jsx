import React, {useState,useEffect} from 'react';
import './AssignToProject.css'
import { useProjectContext } from '../Context';
import { X } from 'lucide-react';

const AssignToProject = ({closeModal}) =>{
    const { projects, selectedProject } = useProjectContext();
    const [users, setUsers] = useState([]);

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

    const handleModalClose = () => {
        closeModal(false);
    };

    const handleAssignUserButton = () => {
        closeModal(false);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2 className="assignUsersTitle">Users</h2>
                {projects.map((assignedUsers) => (
                    assignedUsers.projectId === selectedProject ? 
                        (
                        <div className='users' key={assignedUsers.projectId}>
                            {assignedUsers.userIds.map((userId) => {
                                const user = users.find((u) => u.id === userId);
                                return user ? (
                                    <span className='userName' key={user.id}>{user.userName}<div className='x'><X size={20} color="red"/></div><br /></span>
                                ) : null;
                            })}
                        </div>
                        ) : null
                ))}
            <button className="assignUserButton" onClick={handleAssignUserButton}>Add User</button>
            <button className="assignUserButton" onClick={handleModalClose}>Close</button>
            </div>
        </div>
    );
}

export default AssignToProject;