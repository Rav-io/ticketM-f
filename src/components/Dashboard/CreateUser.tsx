import { useState, useEffect } from 'react';
import { useAuth } from '../../Auth';

interface CreateUserProps {
    openModal: (value: boolean) => void;
}

interface Role {
    id: number;
    name: string;
}

const CreateUser = ({openModal}:CreateUserProps) => {
    const [errorText, setErrorText] = useState<string>('');
    const [newUserName, setNewUserName] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [roles, setRoles] = useState<Role[]>([]);
    const { token } = useAuth();

    const handleModalClose = () => {
        openModal(false);
    };
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://localhost:7091/api/user/getroles', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch roles');
                }
                const data: Role[] = await response.json();
                setRoles(data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchUsers();
    }, [token]);

    const handleModalSubmit = () => {
        if (!newUserName.trim()) {
            setErrorText('User name field is requierd!');
            return;
        }
        const registerData = {
            userName: newUserName,
            password: "default_password",
            role: selectedRole
        };
        fetch("https://localhost:7091/api/user/signup", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
        })
        .then((response) => {
            if (response.ok) {
                openModal(false);
            }
        })
        .catch((error) => {
          console.error('Error assigning users:', error);
        });
    };

    const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(e.target.value);
    }

    return (
        <div className="modal">
          <div className="modal-content">
              <h2 className="addUserTitle">Add User</h2>
              <input
                className="addUserInput"
                type="text"
                placeholder="Enter User Name"
                maxLength={30}
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
              <span><b>Select Users: </b></span><br />
                    <select className="roleSelect" onChange={handleRoleSelect}>
                        {roles.map((role) => (
                            <option key={role.id} value={role.name}>{role.name}</option>
                        ))}
                    </select><br />
              {errorText && <span style={{ color: 'red' }}>{errorText}</span>}<br /><br />
            <button className="addUserButton" onClick={handleModalSubmit}>Submit</button>
            <button className="addUserButton" onClick={handleModalClose}>Close</button>
          </div>
        </div>
    );
};

export default CreateUser;
