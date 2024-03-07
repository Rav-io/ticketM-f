import React, {useState,useEffect} from 'react';
import './AssignToProject.css'
import { useProjectContext } from '../Context';
import { X, Check } from 'lucide-react';

interface AssignToProjectProps {
    closeModal: (value: boolean) => void;
}
interface User {
    id: number;
    userName: string;
}

interface AssignedUser {
    userId: number;
    userName: string;
}

const AssignToProject = ({closeModal}:AssignToProjectProps) =>{
    const { selectedProject } = useProjectContext();
    const [users, setUsers] = useState<User[]>([]);
    const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([]);
    const [addUser, setAddUser] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [renderList, setRenderList] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await fetch(`https://localhost:7091/api/project/${selectedProject}/users`);
            if (!response.ok) {
            throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setAssignedUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        };
        fetchUsers();
    }, [renderList]);

    const handleModalClose = () => {
        closeModal(false);
    };

    const handleAssignUserButton = () => {
        if(addUser){
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
            setAddUser(false);
        } else {
            const assignData = {
                id: selectedProject,
                userId: selectedUsers
            };
            fetch("https://localhost:7091/api/project/assign", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(assignData),
            })
            .then((response) => {
                if (response.ok) {
                    setRenderList(!renderList);
                    setAddUser(!addUser);
                    setSelectedUsers([]);
                }
            })
            .catch((error) => {
              console.error('Error assigning users:', error);
            });
        }
    };

    const handleUserSelect = (userId:number) => {
        setSelectedUsers((prevSelectedUsers) => {
            if (prevSelectedUsers.includes(userId)) {
                return prevSelectedUsers.filter((id) => id !== userId);
            } else {
                return [...prevSelectedUsers, userId];
            }
        });
    };

    const handleX = (selectedUser:number) => {
        const unassignData = {
            id: selectedProject,
            userId: selectedUser
        };
        fetch("https://localhost:7091/api/project/unassign", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(unassignData),
        })
        .then((response) => {
            if (response.ok) {
                setRenderList(!renderList);
            }
        })
        .catch((error) => {
          console.error('Error unassigning users:', error);
        });
    }

    return (
    <div className="modal">
      <div className="modal-content">
        {addUser ? (
          <div>
            <h2 className="assignUsersTitle">Users</h2>
            <div className="users">
              {assignedUsers.map((user) => (
                <div className="userName" key={user.userId}>
                  <span>{user.userName}</span>
                  <div className="x">
                    <X size={20} color="red" onClick={() => handleX(user.userId)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="assignUsersTitle">Assign users</h2>
            <div className="users">
              {users
                .filter((user) => !assignedUsers.some((assignedUser) => assignedUser.userId === user.id))
                .map((user) => (
                  <div
                    className="userNameAssign"
                    key={user.id}
                    style={{ backgroundColor: selectedUsers.includes(user.id) ? '#d6d5d5' : '#f2f2f2' }}
                  >
                    <span>{user.userName}</span>
                    <div className="x">
                      <Check size={20} color="green" onClick={() => handleUserSelect(user.id)} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        <button className="assignUserButton" onClick={handleAssignUserButton}>
          Add Users
        </button>
        <button className="assignUserButton" onClick={handleModalClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default AssignToProject;