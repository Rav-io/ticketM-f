import { useProjectContext } from '../Context';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../Auth';

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
    };
    showModal:any;
}

const TaskDetails = ({currentTask,showModal}:TaskDetailsProps) => {
    const { statusList } = useProjectContext();
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
    return (
        <div className='modalTask'>
            <div className='taskDetailsModal'>
                <strong>Task Name:</strong> {currentTask.taskName}<br/>
                <strong>Task Description:</strong> {currentTask.taskDescription}<br/>
                <strong>Task Status:</strong> {getStatusName(currentTask.taskStatus)}<br/>
                <strong>Task Created:</strong> 
                {currentTask.creationDate.replace('T', ' ').slice(0,-8)}<br />
                <strong>Users:</strong>
                {currentTask.users.map((user) => (
                    <div key={user.id}>{user.userName}</div>
                ))}
                <button className='taskDetailsBack' onClick={handleDetailsBack}>Back</button>
            </div>
        </div>
    );
};

export default TaskDetails;
