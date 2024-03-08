import { useLocation } from 'react-router-dom';
import './TaskDetails.css'
import { useProjectContext } from '../Context';
import { useNavigate } from 'react-router-dom';
import TopMenu from '../TopMenu/TopMenu';

interface User {
    id: number;
    userName: string;
}

interface Task {
    id: number;
    taskName: string;
    taskDescription: string;
    taskStatus: number;
    creationDate: string;
    users: User[];
}

const TaskDetails = () => {
    const { statusList } = useProjectContext();
    const navigate = useNavigate();
    const location = useLocation();
    const task: Task = (location.state as any)?.task;

    const getStatusName = (statusValue:number) => {
        const statusObject = statusList.find(item => item.value === statusValue);
        return statusObject ? String(statusObject.name) : null;
    };

    const handleDetailsBack = () => {
        navigate(`/dashboard`);
    };

    return (
        <div className='taskDetails'>
            <TopMenu />
            <hr></hr>
            <button className='taskDetailsBack' onClick={handleDetailsBack}>Back</button>
                <div className='taskData'>
                    <strong>Task Name:</strong> {task.taskName}<br/>
                    <strong>Task Description:</strong> {task.taskDescription}<br/>
                    <strong>Task Status:</strong> {getStatusName(task.taskStatus)}<br/>
                    <strong>Task Created:</strong> 
                        {task.creationDate.replace('T', ' ').slice(0,-8)}<br />
                    <strong>Users:</strong>
                    {task.users.map((user) => (
                        <div key={user.id}>{user.userName}</div>
                    ))}
                </div>
        </div>
    );
};

export default TaskDetails;
