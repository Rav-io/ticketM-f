import { useProjectContext } from '../Context';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../Auth';
import picture from "../../icons/profile.png";

interface User {
    id: number;
    userName: string;
}

interface TaskDetailsProps {
    currentTask: {
        id: number;
        taskStatus: number;
        taskDescription: string;
        creationDate: string;
        taskName?: string;
        users: User[];
        createdBy: string;
    };
    showModal:any;
}

const TaskDetails = ({currentTask, showModal}:TaskDetailsProps) => {
    const { statusList, setRefreshTasks } = useProjectContext();
    const [editedTaskDescription, setEditedTaskDescription] = useState(currentTask.taskDescription);
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        if (!token) {   
            navigate('/');
        }
    }, [token, navigate]);

    const getStatusName = (statusValue:number) => {
        const statusObject = statusList.find(item => item.value === statusValue);
        return statusObject ? String(statusObject.name) : null;
    };

    const handleDetailsBack = () => {
        showModal(false);
    };
    const handleDetailsSave = async () => {
        const requestData = {
            taskName: currentTask.taskName,
            taskDescription: editedTaskDescription,
            taskStatus: currentTask.taskStatus,
            users: currentTask.users,
        };

        try {
            const response = await fetch(`https://localhost:7091/api/task/edittask/${currentTask.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                showModal(false);
                setRefreshTasks((prevRefreshTasks) => !prevRefreshTasks);
            } else {
                console.error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleTaskDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedTaskDescription(e.target.value);
    };

    return (
        <div className='modalTask'>
            <div className='taskDetailsModal'>
                <span className='taskDetailsTitle'><strong>{currentTask.taskName}</strong> #{currentTask.id}<br/></span>
                <span className='taskDetailsStatus'><strong>{getStatusName(currentTask.taskStatus)}</strong><br/></span>
                <strong>{currentTask.createdBy}</strong> opened this issue on {currentTask.creationDate.replace('T', ' ').slice(0,-8)}<br />
                <textarea 
                    className='taskDetailsDescription' 
                    value={editedTaskDescription}
                    onChange={handleTaskDescriptionChange}
                >
                </textarea>
                <div className='taskDetailsAssignees'>
                    <strong>Assignees:</strong>
                    {currentTask.users.map((user) => (
                        <div key={user.id}>
                            <img
                                key={user.id}
                                src={picture}
                                className="user-image"
                                alt=''
                            />
                            {user.userName}
                        </div>
                    ))}
                </div>
                <button className='taskDetailsSave' onClick={handleDetailsSave}>Save</button>
                <button className='taskDetailsBack' onClick={handleDetailsBack}>Back</button>
            </div>
        </div>
    );
};

export default TaskDetails;
